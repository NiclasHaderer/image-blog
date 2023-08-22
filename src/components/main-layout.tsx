import {FC, ReactNode} from "react";
import Link from "next/link";

export const MainLayout: FC<{
    children: ReactNode;
}> = ({children}) => {
    return <>
        <Navbar/>
        <main>{children}</main>
        <Footer/>
    </>
}


const Navbar: FC = () => {
    return <nav>
        <Link href={"/"}>
            Home
        </Link>
        <Link href={"/about"}>
            About
        </Link>
        <Link href={"/contact"}>
            Contact
        </Link>
        <Link href={"/blog"}>
            Blog
        </Link>
        <Link href={"/wedding-photography"}>
            Wedding Photography
        </Link>
        <Link href={"/animal-photography"}>
            Animal Photography
        </Link>
    </nav>
}

const Footer: FC = () => {
    return <footer>
        <Link href={"/licenses"}>
            Licenses
        </Link>
    </footer>
}

/*
1. Wedding photography
2. Animal photography
3. Blog
*/
