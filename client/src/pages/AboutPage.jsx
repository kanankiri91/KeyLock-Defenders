import {Container,Row,Col} from "react-bootstrap"
import React, { useState,useEffect } from 'react';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const navigateTo = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get(`${backendUrl}/token`);
      setToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setName(decoded.name);
      setExpire(decoded.exp)
    } catch (error) {
      if(error){
        navigateTo('/login')
      }
    }
  }
  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(async(config) => {
    const currentDate = new Date();
    if (expire * 1000 < currentDate.getTime()){
      const response = await axios.get(`${backendUrl}/token`);
      config.headers.Authorization = `bearer ${response.data.accessToken}`;
      setToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setName(decoded.name);
      setExpire(decoded.exp)
    }
    return config
  }, (error) => {
    return Promise.reject(error);
  })
  return (
    <div className="aboutPage overflow-hidden">
      <div className="about min-vh-100">
        <Container>
          <Row>
            <Col>
              <h1 className="fw-bold text-center mb-2 animate__animated animate__fadeInUp">Tentang Aplikasi ini</h1>
              <p className="text-center mt-4 pt-4 px-5 animate__animated animate__fadeInUp">KeyLock hadir sebagai solusi bagi masyarakat untuk 
                secara rutin memeriksa apakah email mereka terlibat 
                dalam kasus kebocoran data. Kami juga menyediakan fitur-fitur 
                untuk meningkatkan keamanan sebelum atau setelah terjadinya 
                kebocoran data, khususnya terkait dengan penggunaan email. 
                Dengan KeyLock, kami berharap dapat membantu masyarakat 
                menghindari kasus kebocoran data di dunia maya, sehingga 
                menciptakan lingkungan digital yang lebih aman dan lebih 
                baik untuk Indonesia.</p>
            </Col>
          </Row>
          <Row>
          <Col className="pr-5 pl-5 animate__animated animate__fadeInUp" style={{ padding: '0 60px' }}>
    <h1 className="fw-bold text-center mb-2 mt-5 pt-5 animate__animated animate__fadeInUp">Kebijakan Privasi</h1>
    <p className="text-center animate__animated animate__fadeInUp" style={{ marginBottom: '60px' }}>Informasi kebijakan privasi yang ditetapkan oleh KeyLock.</p>
    <h4 className="fw-bold mt-4 animate__animated animate__fadeInUp" style={{ marginBottom: '20px' }}>Pengumpulan Data</h4>
    <p className="mt-3 animate__animated animate__fadeInUp" style={{ marginBottom: '60px' }}>KeyLock menggunakan sumber terbuka dari <a href="https://haveibeenpwned.com/" style={{ textDecoration: 'none', color: '#071d28' }}>HaveIBeenPwned</a>  untuk 
    mendapatkan informasi mengenai kebocoran data. Untuk melakukan pemeriksaan kebocoran 
        data Anda, kami memerlukan alamat email Anda. Kami tidak menyimpan informasi alamat email yang 
        Anda masukkan.</p>
    
    <h4 className="fw-bold mt-4 animate__animated animate__fadeInUp" style={{ marginBottom: '20px' }}>Tujuan Pengumpulan Data</h4>
    <p className="mt-3 animate__animated animate__fadeInUp" style={{ marginBottom: '60px' }}>Informasi yang kami peroleh digunakan untuk memproses aplikasi dan komunikasi yang diajukan oleh Anda, serta untuk melakukan komunikasi dengan Anda.</p>

    <h4 className="fw-bold mt-4 animate__animated animate__fadeInUp" style={{ marginBottom: '20px' }}>Pemberian dan Pengungkapan Informasi</h4>
    <p className="mt-3 animate__animated animate__fadeInUp" style={{ marginBottom: '60px' }}>Kami tidak akan menjual, mengalihkan, mendistribusikan, atau membuka informasi pribadi Anda kepada pihak lain atau pihak ketiga yang tidak berkepentingan, kecuali untuk kepentingan pengumpulan data sebagaimana telah diungkapkan di atas.</p>

    <h4 className="fw-bold mt-4 animate__animated animate__fadeInUp" style={{ marginBottom: '20px' }}>Koneksi ke Situs Lain</h4>
    <p className="mt-3 animate__animated animate__fadeInUp" style={{ marginBottom: '60px' }}>Kami menyediakan link ke situs pihak ketiga untuk mempermudah penggunaan Anda. Namun, kami tidak bertanggung jawab atas informasi yang Anda berikan kepada situs-situs tersebut. Setiap situs memiliki kebijakan privasi tersendiri dan Anda harus mempelajari kebijakan privasi mereka sebelum memberikan informasi Anda.</p>

    <h4 className="fw-bold mt-4" style={{ marginBottom: '20px' }}>Kontak</h4>
    <p className="mt-3" style={{ marginBottom: '200px' }}>Entitas apapun yang Anda pilih sebagai kontak atau berinteraksi, baik yang terdaftar dalam direktori atau di tempat lain selain dari situs KeyLock, adalah tanggung jawab layanan tersebut pada Anda. KeyLock tidak bertanggung jawab atas kerusakan, kerugian, atau biaya yang timbul atas interaksi yang terjadi antara Anda dan layanan tersebut.</p>
</Col>

          </Row>
        </Container>
      </div>
    </div>
  )
}

export default AboutPage