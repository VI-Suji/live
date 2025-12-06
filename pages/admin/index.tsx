import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

export default function AdminIndex() {
    // This component will not be rendered because of the redirect
    return null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);

    if (session) {
        return {
            redirect: {
                destination: "/admin/dashboard",
                permanent: false,
            },
        };
    }

    return {
        redirect: {
            destination: "/admin/login",
            permanent: false,
        },
    };
};
