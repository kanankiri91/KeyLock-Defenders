import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import BadakImage from "../assets/badak.png";
import Form from 'react-bootstrap/Form';
import axios from "axios";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // perbaiki impor ini

const CekPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [role, setRole] = useState('');
    const navigateTo = useNavigate();

    useEffect(() => {
        refreshToken();
    }, []);

    const refreshToken = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/token`);
            setToken(response.data.accessToken);
            const decoded = jwtDecode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
            setRole(decoded.role);
            if (decoded.role === 1) {
                navigateTo('/admin');
            }
        } catch (error) {
            if (error) {
                navigateTo('/login');
            }
        }
    };

    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get(`http://localhost:5000/token`);
            config.headers.Authorization = `bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwtDecode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
            setRole(decoded.role);
            if (decoded.role === 1) {
                navigateTo('/admin');
            }
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    const handleIdentifikasi = async () => {
        try {
            const response = await axios.post('http://localhost:9696/cek-password', { user_password: password }, { withCredentials: true });
            const passwordStrength = response.data.password_strength;
            let message = '';
            let icon = '';

            if (passwordStrength === 0) {
                message = 'Password Lemah';
                icon = 'error';
            } else if (passwordStrength === 1) {
                message = 'Password baik';
                icon = 'info';
            } else if (passwordStrength === 2) {
                message = 'Password sangat kuat';
                icon = 'success';
            }

            Swal.fire({
                title: 'Pengecekan selesai!',
                text: message,
                icon: icon,
                backdrop: `rgba(0,0,0,0.8) url("https://i.pinimg.com/originals/63/13/79/63137910e4cbb9097a81f6b8e6836623.gif") center center no-repeat`,
                showConfirmButton: true,
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    setPassword('');
                }
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="cekpassword">
            <header className="w-100 min-vh-100 d-flex align-items-center overflow-hidden">
                <Container>
                    <Row className="header-box d-flex align-items-center">
                        <Col lg="6" className="pt-lg-0 pt-5">
                            <img src={BadakImage} alt="hero_img" className="animate__animated animate__zoomInUp" />
                        </Col>
                        <Col lg="6">
                            <h1 className="mb-4 text-right animate__animated animate__fadeInRightBig animate__delay-1s">Bagaimana <br /> <span>dengan</span><br />password-mu ?</h1>
                            <p className="mb-4 text-right animate__animated animate__fadeInRightBig animate__delay-1s">Cek kekuatan password Anda dengan KeyLock, website yang dapat membantu menilai kekuatan password Anda. Jika Password anda lemah silahkan mencoba rekomendasi generator yang membantu anda membuat password yang lebih baik.</p>
                            <form className="animate__animated animate__bounceInUp animate__delay-1s">
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Masukkan Password Anda"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ width: '100%', height: '50px' }}
                                    />
                                    <div className="d-flex justify-content-center mt-1 ">
                                        <button
                                            type="button"
                                            className="btn btn-link text-decoration-none text-white"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? "Sembunyikan" : "Tampilkan"}
                                        </button>
                                    </div>
                                </Form.Group>
                                <div className="d-flex justify-content-center animate__animated animate__bounceInUp animate__delay-1s">
                                    <button
                                        type="button"
                                        className="btn btn-outline-light btn-lg rounded-1 me-2 identifikasi-button"
                                        style={{ width: '30%', height: '45px' }}
                                        onClick={handleIdentifikasi}
                                    >
                                        Identifikasi
                                    </button>
                                </div>
                                <div className="d-flex justify-content-center animate__animated animate__bounceInUp animate__delay-1s mt-2">
                                    <button
                                        type="button"
                                        className="btn btn-outline-light btn-lg rounded-1 me-2 mt-3 identifikasi-button"
                                        style={{ width: '30%', height: '80px' }}
                                        onClick={() => window.open('https://passwordsgenerator.net/', '_blank')}
                                    >
                                        Password Generator
                                    </button>
                                </div>
                            </form>
                        </Col>
                    </Row>
                </Container>
            </header>
        </div>
    );
}

export default CekPasswordPage;
