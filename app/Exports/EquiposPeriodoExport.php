<?php

namespace App\Exports;

use App\Http\Controllers\ReportesController;
use App\Models\Equipo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Font;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class EquiposPeriodoExport implements
    FromCollection,
    WithCustomStartCell,
    WithHeadings,
    WithMapping,
    ShouldAutoSize,
    WithStyles,
    WithColumnFormatting,
    WithEvents
{
    protected Carbon $desde;
    protected Carbon $hasta;
    protected string $filtroEstado;
    protected Collection $equipos;

    public function __construct(string $fechaDesde, string $fechaHasta, string $filtroEstado = 'todos')
    {
        $this->desde = Carbon::parse($fechaDesde)->startOfDay();
        $this->hasta = Carbon::parse($fechaHasta)->endOfDay();
        $this->filtroEstado = $filtroEstado;

        $estadosIds = match ($this->filtroEstado) {
            'retirados'  => [ReportesController::ESTADO_RETIRADO],
            'cancelados' => [ReportesController::ESTADO_CANCELADO],
            default      => [ReportesController::ESTADO_CANCELADO, ReportesController::ESTADO_RETIRADO],
        };

        $this->equipos = Equipo::with(['cliente', 'estado', 'tecnico', 'presupuesto'])
            ->whereIn('estado_id', $estadosIds)
            ->whereBetween('updated_at', [$this->desde, $this->hasta])
            ->orderBy('updated_at', 'desc')
            ->get();
    }

    public function startCell(): string
    {
        return 'A5';
    }

    public function collection(): Collection
    {
        return $this->equipos;
    }

    public function headings(): array
    {
        return [
            '#Orden',
            'Fecha Ingreso',
            'Fecha Cierre',
            'Equipo / Modelo',
            'Cliente',
            'DNI Cliente',
            'Estado Final',
            'Técnico Asignado',
            'Monto Facturado',
        ];
    }

    /**
     * @param Equipo $equipo
     */
    public function map($equipo): array
    {
        $esRetirado = (int) $equipo->estado_id === ReportesController::ESTADO_RETIRADO;

        return [
            $equipo->id,
            $equipo->created_at?->format('d/m/Y'),
            $equipo->updated_at?->format('d/m/Y H:i'),
            $equipo->nombre,
            trim(($equipo->cliente?->nombre ?? '') . ' ' . ($equipo->cliente?->apellido ?? '')),
            $equipo->cliente?->dni ?? 'Sin registrar',
            strtoupper($equipo->estado?->nombre ?? ''),
            $equipo->tecnico?->name ?? 'Sin asignar',
            $esRetirado ? (float) ($equipo->presupuesto?->monto ?? 0) : 0.0,
        ];
    }

    public function columnFormats(): array
    {
        return [
            'I' => '$#,##0.00',
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            // Fila 5 (Encabezados de tabla)
            5 => [
                'font' => [
                    'bold'  => true,
                    'color' => ['rgb' => 'A3E635'],
                ],
                'fill' => [
                    'fillType'   => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '0D0D0D'],
                ],
            ],
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();

                $totalEquipos = $this->equipos->count();
                $cantidadRetirados = $this->equipos->where('estado_id', ReportesController::ESTADO_RETIRADO)->count();
                $cantidadCancelados = $this->equipos->where('estado_id', ReportesController::ESTADO_CANCELADO)->count();
                $totalFacturado = $this->equipos
                    ->where('estado_id', ReportesController::ESTADO_RETIRADO)
                    ->sum(fn($e) => (float) ($e->presupuesto?->monto ?? 0));

                // Encabezado principal del reporte (Filas 1 a 3)
                $sheet->mergeCells('A1:I1');
                $sheet->setCellValue('A1', 'REPORTE DE EQUIPOS RETIRADOS Y CANCELADOS - SERVICIO TÉCNICO');

                $sheet->mergeCells('A2:I2');
                $sheet->setCellValue(
                    'A2',
                    sprintf(
                        'Período evaluado: %s al %s   |   Emitido: %s',
                        $this->desde->format('d/m/Y'),
                        $this->hasta->format('d/m/Y'),
                        now()->format('d/m/Y H:i')
                    )
                );

                $sheet->mergeCells('A3:I3');
                $sheet->setCellValue(
                    'A3',
                    sprintf(
                        'Total Movimientos: %d   |   Equipos Retirados: %d   |   Equipos Cancelados: %d   |   Importe Total (Retirados): $%s',
                        $totalEquipos,
                        $cantidadRetirados,
                        $cantidadCancelados,
                        number_format($totalFacturado, 2, ',', '.')
                    )
                );

                $sheet->getStyle('A1:I1')->applyFromArray([
                    'font' => [
                        'bold'  => true,
                        'size'  => 14,
                        'color' => ['rgb' => 'A3E635'],
                    ],
                    'fill' => [
                        'fillType'   => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => '0D0D0D'],
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_LEFT,
                        'vertical'   => Alignment::VERTICAL_CENTER,
                    ],
                ]);
                $sheet->getRowDimension(1)->setRowHeight(26);

                $sheet->getStyle('A2:I2')->applyFromArray([
                    'font' => [
                        'size'  => 10,
                        'color' => ['rgb' => 'E5E7EB'],
                    ],
                    'fill' => [
                        'fillType'   => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => '171717'],
                    ],
                ]);
                $sheet->getRowDimension(2)->setRowHeight(20);

                $sheet->getStyle('A3:I3')->applyFromArray([
                    'font' => [
                        'bold'  => true,
                        'size'  => 10,
                        'color' => ['rgb' => '111827'],
                    ],
                    'fill' => [
                        'fillType'   => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'F3F4F6'],
                    ],
                    'borders' => [
                        'bottom' => [
                            'borderStyle' => Border::BORDER_MEDIUM,
                            'color'       => ['rgb' => 'A3E635'],
                        ],
                    ],
                ]);
                $sheet->getRowDimension(3)->setRowHeight(22);

                // Estilizar y subrayar cada fila según estado (Verde = Retirado, Rojo = Cancelado)
                $rowIndex = 6;
                foreach ($this->equipos as $equipo) {
                    $esRetirado = (int) $equipo->estado_id === ReportesController::ESTADO_RETIRADO;
                    $range = "A{$rowIndex}:I{$rowIndex}";

                    if ($esRetirado) {
                        $sheet->getStyle($range)->applyFromArray([
                            'fill' => [
                                'fillType'   => Fill::FILL_SOLID,
                                'startColor' => ['rgb' => 'DCFCE7'],
                            ],
                            'font' => [
                                'color'     => ['rgb' => '14532D'],
                                'underline' => Font::UNDERLINE_SINGLE,
                            ],
                            'borders' => [
                                'bottom' => [
                                    'borderStyle' => Border::BORDER_MEDIUM,
                                    'color'       => ['rgb' => '16A34A'],
                                ],
                            ],
                        ]);
                    } else {
                        $sheet->getStyle($range)->applyFromArray([
                            'fill' => [
                                'fillType'   => Fill::FILL_SOLID,
                                'startColor' => ['rgb' => 'FEE2E2'],
                            ],
                            'font' => [
                                'color'     => ['rgb' => '7F1D1D'],
                                'underline' => Font::UNDERLINE_SINGLE,
                            ],
                            'borders' => [
                                'bottom' => [
                                    'borderStyle' => Border::BORDER_MEDIUM,
                                    'color'       => ['rgb' => 'DC2626'],
                                ],
                            ],
                        ]);
                    }

                    $rowIndex++;
                }
            },
        ];
    }
}
