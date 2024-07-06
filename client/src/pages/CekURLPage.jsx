import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import PesutImage from "../assets/pesut.png";
import Form from 'react-bootstrap/Form';
import axios from "axios";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; // tambahkan ini
import {jwtDecode} from 'jwt-decode'; // perbaiki impor ini

const CekURLPage = () => {
    const [url, setUrl] = useState('');
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [role, setRole] = useState(''); // tambahkan ini
    const navigateTo = useNavigate();

    useEffect(() => {
        refreshToken();
    }, []);

    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decoded = jwtDecode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
            setRole(decoded.role); // tambahkan ini
            if (decoded.role === 1) { // tambahkan ini
                navigateTo('/admin'); // tambahkan ini
            }
        } catch (error) {
            if (error) {
                navigateTo('/login')
            }
        }
    }

    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get('http://localhost:5000/token');
            config.headers.Authorization = `bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwtDecode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
            setRole(decoded.role); // tambahkan ini
            if (decoded.role === 1) { // tambahkan ini
                navigateTo('/admin'); // tambahkan ini
            }
        }
        return config
    }, (error) => {
        return Promise.reject(error);
    })

    const handleIdentifikasi = async () => {
        try {
            const response = await axios.post('http://localhost:5000/cek-url', {
                url: url
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = response.data;
            console.log(data);

            if (data.message === 'URL Anda mengandung phishing') {
                Swal.fire({
                    title: 'Pengecekan selesai!',
                    text: 'URL ini terindikasi sebagai phishing.',
                    icon: 'info',
                    confirmButtonText: 'OK'
                }).then(() => {
                    setUrl(''); // Mengatur nilai input kembali kosong setelah pengguna mengklik OK
                });
            } else {
                Swal.fire({
                    title: 'Pengecekan selesai!',
                    text: 'URL ini aman.',
                    icon: 'info',
                    confirmButtonText: 'OK'
                }).then(() => {
                    setUrl('');
                });
            }
        } catch (error) {
            console.error('Error checking URL:', error);
        }
    };

    return (
        <div className="cekURL">
            <header className="w-100 min-vh-100 d-flex align-items-center overflow-hidden">
                <Container>
                    <Row className="header-box d-flex align-items-center">
                        <Col lg="6">
                            <h1 className="mb-4 animate__animated animate__fadeInLeftBig animate__delay-1s">Kamu Yakin <br /> <span>URL yang kamu akses</span><br />Sudah Aman ?</h1>
                            <p className="mb-4 animate__animated animate__fadeInLeftBig animate__delay-1s">Cek URL Anda apakah mengandung phishing dengan KeyLock, sebuah website yang membantu mengidentifikasi potensi phishing pada URL yang Anda temui.</p>
                            <form className="animate__animated animate__bounceInUp animate__delay-1s">
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Control
                                        type="text"
                                        placeholder="Masukkan URL Anda"
                                        style={{ width: '100%', height: '50px' }}
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                    />
                                </Form.Group>
                            </form>
                            <div className="d-flex justify-content-center animate__animated animate__bounceInUp animate__delay-1s">
                                <button
                                    className="btn btn-outline-dark btn-lg rounded-1 me-2 identifikasi-button"
                                    style={{ width: '30%', height: '45px' }}
                                    onClick={handleIdentifikasi}
                                >
                                    Identifikasi
                                </button>
                            </div>
                        </Col>
                        <Col lg="6" className="pt-lg-0 pt-5">
                            <img src={PesutImage} alt="hero_img" style={{ transform: 'scaleX(-1)' }} className="animate__animated animate__zoomInUp" />
                        </Col>
                    </Row>
                </Container>
            </header>
        </div>
    );
}

export default CekURLPage;
