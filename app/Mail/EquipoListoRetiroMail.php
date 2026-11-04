<?php

namespace App\Mail;

use App\Models\Equipo;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EquipoListoRetiroMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Equipo $equipo
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "¡Tu equipo está listo para retirar! - #{$this->equipo->id} {$this->equipo->nombre}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.equipo_listo_retiro',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
