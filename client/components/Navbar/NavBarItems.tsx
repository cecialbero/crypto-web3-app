import { FC } from 'react'

type NavbarItemsProps = {
    title: string;
    classProps?: string
}

const NavbarItems: FC<NavbarItemsProps> = ({ title, classProps }) => {
    return (
        <li className={`mx-4 cursor-pointer ${classProps}`}>
            {title}
        </li>
    )
}

export default NavbarItems