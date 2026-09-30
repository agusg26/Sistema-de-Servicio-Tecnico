import { FC } from 'react'
import NavBar from '../Components/NavBar'

interface Props {
    children: React.ReactNode
}

export const MainLayout: FC<Props> = ({ children }) => {
    return (
        <div className="min-h-screen bg-black text-white">
            <NavBar />
            {children}
        </div>
    )
}
