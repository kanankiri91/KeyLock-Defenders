import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [dataAkunValues, setDataAkunValues] = useState([]);
  const [newFullname, setNewFullname] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State untuk indikator loading
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
    } catch (error) {
      console.error(error);
      navigateTo('/login');
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(async (config) => {
    const currentDate = new Date();
    if (expire * 1000 < currentDate.getTime()) {
      const response = await axios.get('http://localhost:5000/token');
      config.headers.Authorization = `Bearer ${response.data.accessToken}`;
      setToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setName(decoded.name);
      setExpire(decoded.exp);
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosJWT.get('http://localhost:5000/profile');
      setUser(response.data.userProfile);
      setDataAkunValues(response.data.dataAkunValues);
    } catch (error) {
      console.error(error);
      navigateTo('/login');
    }
  };

  const handleUpdateFullname = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Aktifkan indikator loading sebelum permintaan
    try {
      await axiosJWT.put('http://localhost:5000/profile/fullname', { fullname: newFullname });
      Swal.fire({
        title: 'Success',
        text: 'Fullname updated successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        fetchUserProfile();
        setNewFullname('');
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update fullname',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsLoading(false); // Nonaktifkan indikator loading setelah selesai
    }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Aktifkan indikator loading sebelum permintaan
    try {
      await axiosJWT.put('http://localhost:5000/profile/email', { email: newEmail });
      Swal.fire({
        title: 'Success',
        text: 'Email updated successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        fetchUserProfile();
        setNewEmail('');
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update email',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsLoading(false); // Nonaktifkan indikator loading setelah selesai
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Aktifkan indikator loading sebelum permintaan
    try {
      await axiosJWT.put('http://localhost:5000/profile/password', { oldPassword, newPassword });
      Swal.fire({
        title: 'Success',
        text: 'Password updated successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        fetchUserProfile();
        setOldPassword('');
        setNewPassword('');
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update password',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsLoading(false); // Nonaktifkan indikator loading setelah selesai
    }
  };

  const handleUpdateKeterangan = async (id, currentKeterangan) => {
    setIsLoading(true);
    try {
      await axiosJWT.put('http://localhost:5000/update-keterangan', {
        id,
        keterangan: currentKeterangan === 1 ? 0 : 1
      });

      setDataAkunValues(prevValues =>
        prevValues.map(akun => ({
          ...akun,
          informasi_webs: akun.informasi_webs.map(info =>
            info.id === id ? { ...info, keterangan: currentKeterangan === 1 ? 0 : 1 } : info
          )
        }))
      );

      Swal.fire({
        title: 'Success',
        text: 'Keterangan berhasil diperbarui',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error('Error updating keterangan:', error);
      Swal.fire({
        title: 'Error',
        text: 'Terjadi kesalahan saat memperbarui keterangan',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="profile-container">
      <Row>
        <Col md={12}>
          <h2 className="profile-heading">Hai, {name} </h2><br/>
          <h5 className="profile-heading-2"> Selamat datang kembali di KeyLock. <br/>Berikut kami tampilkan informasi lengkap mengenai akun kamu. Selamat menjelajahi dunia siber bersama KeyLock</h5>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <h3 className="profile-subheading">User Profile</h3>
          <Form className="profile-form" onSubmit={handleUpdateFullname}>
            <Form.Group controlId="fullname">
              <Form.Label className="profile-label">Full Name</Form.Label>
              <Form.Control
                type="text"
                value={newFullname}
                onChange={(e) => setNewFullname(e.target.value)}
              />
            </Form.Group>
            <Button className="profile-button" variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Fullname'}
            </Button>
          </Form>
          <Form className="profile-form" onSubmit={handleUpdateEmail}>
            <Form.Group controlId="email">
              <Form.Label className="profile-label">Email</Form.Label>
              <Form.Control
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </Form.Group>
            <Button className="profile-button" variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Email'}
            </Button>
          </Form>
          <Form className="profile-form" onSubmit={handleUpdatePassword}>
            <Form.Group controlId="oldPassword">
              <Form.Label className="profile-label">Old Password</Form.Label>
              <Form.Control
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="newPassword">
              <Form.Label className="profile-label">New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            <Button className="profile-button" variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </Form>
        </Col>
        <Col md={6}>
          <h3 className="profile-subheading">Account Details</h3>
          <div className="profile-details">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Full Name:</strong> {user.fullname}</p>
          </div>
          <h4 className="profile-subheading">Breach Information</h4>
          {dataAkunValues && dataAkunValues.length > 0 ? (
            <Table striped bordered hover className="futuristic-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Email</th>
                  <th>Nama Website/Aplikasi</th>
                  <th>Keterangan</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dataAkunValues.map((akun, idx) => (
                  akun.informasi_webs.map((info, infoIdx) => (
                    <tr key={info.id}>
                      <td>{idx + 1}.{infoIdx + 1}</td>
                      <td>{akun.value}</td>
                      <td>{info.website}</td>
                      <td>{info.keterangan === 1 ? 'Belum Diamankan' : 'Sudah Ditindaklanjuti'}</td>
                      <td>
                        <Button
                          variant={info.keterangan === 1 ? 'danger' : 'success'}
                          onClick={() => handleUpdateKeterangan(info.id, info.keterangan)}
                          disabled={info.keterangan === 0 || isLoading} // Nonaktifkan tombol saat loading
                        >
                          {isLoading ? 'Updating...' : (info.keterangan === 1 ? 'Belum Diamankan' : 'Sudah Ditindaklanjuti')}
                        </Button>
                      </td>
                    </tr>
                  ))
                ))}
              </tbody>
            </Table>
          ) : (
            <p>Tidak ada informasi breach yang ditemukan.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
