import React, { useState } from 'react';
import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

const CekBreachPage = () => {
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [breachInfo, setBreachInfo] = useState([]);
    const [isSearched, setIsSearched] = useState(false);

    const handleSearch = async () => {
        try {
            const response = await axios.post('http://localhost:5000/breach-info', {
                email,
                whatsapp
            });
            setBreachInfo(response.data.breaches);
            setIsSearched(true);
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Terjadi kesalahan saat mencari informasi breach',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handlePopup = () => {
        Swal.fire({
            title: 'Masukkan Detail Anda',
            html:
                `<div class="input-container">
                    <input type="email" id="email" class="swal2-input" placeholder="Email">
                </div>
                <div class="input-container">
                    <div class="whatsapp-label">+62</div>
                    <input type="text" id="whatsapp" class="swal2-input" placeholder="Nomor WhatsApp">
                </div>`,
            focusConfirm: false,
            customClass: {
                container: 'custom-swal-container',
                popup: 'custom-swal-popup',
                title: 'custom-swal-title',
                confirmButton: 'custom-swal-confirm-button'
            },
            preConfirm: () => {
                const email = Swal.getPopup().querySelector('#email').value;
                const whatsapp = Swal.getPopup().querySelector('#whatsapp').value;
                if (!email || !whatsapp) {
                    Swal.showValidationMessage(`Harap masukkan email dan nomor WhatsApp`);
                }
                setEmail(email);
                setWhatsapp(whatsapp);
            },
            confirmButtonText: 'Cari'
        }).then((result) => {
            if (result.isConfirmed) {
                handleSearch();
            }
        });
    };
     
    
    const handleUpdateKeterangan = async (id, keterangan) => {
        try {
            await axios.post('http://localhost:5000/update-keterangan', {
                id,
                keterangan: keterangan === 1 ? 0 : 1
            });
            setBreachInfo(breachInfo.map(info => 
                info.id === id ? { ...info, keterangan: keterangan === 1 ? 0 : 1 } : info
            ));
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Terjadi kesalahan saat memperbarui keterangan',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <div className="cekBreach">
            <style>
                {`
                    .title-h1 {
                        margin-top: 110px;
                        text-align: center;
                        color: #EEEDEB;
                    }
                    .title-h3 {
                        margin-top: 10px;
                        text-align: center;
                        color: #EEEDEB;
                        font-size: 15px;
                    }
                    .action-button-span {
                        background: #ffcc00;
                        border: none;
                        border-radius: 5px;
                        color: #000;
                        font-weight: bold;
                        padding: 5px 10px;
                        margin-left: 5px;
                    }
                    .futuristic-table {
                        background: rgba(128, 128, 128, 0.5);
                        backdrop-filter: blur(10px);
                        color: white;
                        border-radius: 10px;
                        overflow: hidden;
                        margin-top: 30px;
                        margin-bottom: 130px;
                    }
                    .futuristic-table thead {
                        background: #071952;
                    }
                    .futuristic-table thead th {
                        border: none;
                        color: #071952;
                        font-weight: bold;
                        font-size: 25px;
                        text-align: center;
                    }
                    .futuristic-table tbody tr {
                        transition: background 0.3s ease;
                    }
                    .futuristic-table tbody tr:hover {
                        background: rgba(128, 128, 128, 0.6);
                    }
                    .futuristic-table tbody td {
                        border: none;
                        color: #071952;
                        text-align: center;
                    }
                    .futuristic-table tbody td.left-align {
                        text-align: left;
                    }
                    .futuristic-table tbody td button {
                        background: #ffcc00;
                        border: none;
                        border-radius: 5px;
                        color: #000;
                        font-weight: bold;
                    }
                    .futuristic-table tbody td button.disabled {
                        background: #00cc00;
                        color: white;
                        cursor: not-allowed;
                    }
                    .futuristic-table tbody td button:hover {
                        background: #ff9900;
                    }
                    .futuristic-table tbody td button.disabled:hover {
                        background: #00cc00;
                    }
                    .custom-button {
                        background-color: #55AD9B;
                        color: #2F3645;
                        border: 2px solid #55AD9B;
                        border-radius: 5px;
                        padding: 10px 20px;
                        font-weight: bold;
                        transition: background-color 0.3s ease, color 0.3s ease;
                    }
                    .custom-button:hover {
                        background-color: #EEEDEB;
                        color: #071952;
                    }
                `}
            </style>
            <header className="w-100 min-vh-100 d-flex align-items-center overflow-hidden">
                <Container>
                    {isSearched ? (
                        <>
                            <h1 className="title-h1">WEBSITE YANG DIDUGA MEMBOCORKAN DATA ANDA</h1>
                            <h3 className='title-h3'>
                                *Silahkan klik 
                                <span className="action-button-span">Tindak Lanjut</span>  
                                jika anda sudah mengamankan akun anda
                            </h3>
                            <Table striped bordered hover className="futuristic-table">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Nama Website/Aplikasi</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {breachInfo.map((info, index) => (
                                        <tr key={info.id}>
                                            <td>{index + 1}</td>
                                            <td className="left-align">{info.website}</td>
                                            <td>
                                                <Button
                                                    variant={info.keterangan === 0 ? 'success' : 'warning'}
                                                    disabled={info.keterangan === 0}
                                                    onClick={() => handleUpdateKeterangan(info.id, info.keterangan)}
                                                >
                                                    {info.keterangan === 0 ? 'Sudah Ditindak' : 'Tindak Lanjut'}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </>
                    ) : (
                        <Row className="d-flex justify-content-center">
                            <Col lg="6" className="text-center">
                                <Button className="custom-button" onClick={handlePopup}>
                                    Masukkan Email dan WhatsApp
                                </Button>
                            </Col>
                        </Row>
                    )}
                </Container>
            </header>
        </div>
    );
};

export default CekBreachPage;
