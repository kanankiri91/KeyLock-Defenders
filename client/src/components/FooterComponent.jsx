import {Container,Row,Col} from "react-bootstrap"
import { Link } from "react-router-dom"

const FooterComponent = () => {
  return (
    <div className="footer py-5">
        <Container>
            <Row className="d-flex justify-content-between">
                <Col lg="5">
                    <h3 className="fw-bold">KeyLock</h3>
                    <p className="desc">KeyLog adalah solusi terbaik untuk memastikan keamanan email Anda. Dengan fitur-fitur unggulan yang kami sediakan, kami bertekad untuk membantu anda mengamankan email Anda dan berkontribusi dalam mewujudkan Indonesia yang lebih aman dalam hal keamanan data</p>
                    <div className="no mb-2 mt-4">
                        <Link className="text-decoration-none">
                            <i className="fa-brands fa-whatsapp"></i>
                            <p className="m-0">+62 8xx-xxxx-xxxx</p>
                        </Link>
                    </div>
                    <div className="email mb-2 mt-4">
                        <Link className="text-decoration-none">
                            <i className="fa-regular fa-envelope"></i>
                            <p className="m-0">keylockdefenders@gmail.com</p>
                        </Link>
                    </div>
                    <div className="telegram mt-4">
                        <Link className="text-decoration-none">
                            <i className="fa-brands fa-telegram"></i>
                            <p className="m-0">@admin_keylog</p>
                        </Link>
                    </div>
                </Col>
                <Col className="d-flex flex-column col-lg-3 col ">
                    <h5 className="fw-bold">MENU</h5>
                    <Link to="beranda">Beranda</Link>
                    <Link to="password">Periksa Password</Link>
                    <Link to="url">Periksa URL</Link>
                    <Link to="alertme">Notifikasi</Link>
                    <Link to="about">About</Link>
                </Col>
                <Col className="d-flex flex-column col-lg-3 col">
                    <h5 className="fw-bold">BERAFILIASI DENGAN</h5>
                    <Link to="https://www.idu.ac.id/">RIDU</Link>
                    <Link to="https://haveibeenpwned.com/">HaveIBeenPwned</Link>
                    <h5 className="fw-bold mt-5">IKUTI KAMI</h5>
                    <div className="social mt-2">
                        <i className="fa-brands fa-facebook"></i>
                        <i className="fa-brands fa-twitter"></i>
                        <i className="fa-brands fa-linkedin"></i>
                        <i className="fa-brands fa-instagram"></i>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <p className="text-center px-md-0 px-3">&copy; Copyright {new Date().getFullYear()} by Fahrianda Luthfi - Breach data provided by  <a href="https://haveibeenpwned.com/">HaveIBeenPwned</a></p>
                </Col>
            </Row>
        </Container>
    </div>
  )
}

export default FooterComponent