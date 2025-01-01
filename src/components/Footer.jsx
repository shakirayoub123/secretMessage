

function Footer() {
    return (
        <footer
            className=" text-white"
            style={{
                bottom: 0,
                width: "100%",
                marginTop:"100px"
            }}
        >
            <div className="container text-center">
                <p className="mb-0">
                    &copy; {new Date().getFullYear()} MyApp. All Rights Reserved.
                </p>
                <p className="mb-0">
                    Follow us on{" "}
                    <a
                        href="https://twitter.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary"
                    >
                        Twitter
                    </a>
                    ,{" "}
                    <a
                        href="https://facebook.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary"
                    >
                        Facebook
                    </a>{" "}
                    and{" "}
                    <a
                        href="https://instagram.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary"
                    >
                        Instagram
                    </a>.
                </p>
            </div>
        </footer>
    );
}

export default Footer;
