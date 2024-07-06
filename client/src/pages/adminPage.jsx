import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import {jwtDecode} from 'jwt-decode';

const AdminPage = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // State untuk indikator loading
    const [isRefreshing, setIsRefreshing] = useState(false); // State untuk indikator refresh
    const [role, setRole] = useState(''); // State untuk role
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        verifyRole();
    }, []);

    const verifyRole = async () => {
        try {
            const response = await axios.get(`${backendUrl}/token`);
            const decoded = jwtDecode(response.data.accessToken);
            setRole(decoded.role);
            if (decoded.role !== 1) {
                navigate('/beranda'); // Arahkan pengguna non-admin ke halaman beranda
            }
        } catch (error) {
            navigate('/login');
        }
    };

    useEffect(() => {
        if (role === 1) {
            showInitialSweetAlert();
        }
    }, [role]);

    const showInitialSweetAlert = () => {
        Swal.fire({
            title: 'Pilih Data untuk Ditampilkan',
            showCancelButton: true,
            confirmButtonText: 'Lihat Data Pengguna',
            cancelButtonText: 'Lihat Data Akun',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                handleSelectOption('pengguna');
            } else {
                handleSelectOption('tampilkan-email');
            }
        });
    };

    const fetchAllUsers = async () => {
        setIsLoading(true); // Aktifkan loading sebelum fetch data
        try {
            const response = await axios.get(`${backendUrl}/pengguna`);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false); // Nonaktifkan loading setelah fetch data selesai
        }
    };

    const fetchAllCheckingEmails = async () => {
        setIsLoading(true); // Aktifkan loading sebelum fetch data
        try {
            const response = await axios.get(`${backendUrl}/tampilkan-email`);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching checking emails:', error);
        } finally {
            setIsLoading(false); // Nonaktifkan loading setelah fetch data selesai
        }
    };

    const handleSelectOption = (option) => {
        setSelectedOption(option);
        if (option === 'pengguna') {
            fetchAllUsers();
        } else if (option === 'tampilkan-email') {
            fetchAllCheckingEmails();
        }
    };

    const handleActivateUser = async (id) => {
        try {
            await axios.put(`${backendUrl}/pengguna/activate/${id}`);
            handleSelectOption('pengguna');
        } catch (error) {
            console.error('Error activating user:', error);
        }
    };

    const handleDeactivateUser = async (id) => {
        try {
            await axios.put(`${backendUrl}/pengguna/deactivate/${id}`);
            handleSelectOption('pengguna');
        } catch (error) {
            console.error('Error deactivating user:', error);
        }
    };

    const handleDeleteAkun = async (id) => {
        try {
            await axios.delete(`${backendUrl}/tampilkan-email/${id}`);
            handleSelectOption('tampilkan-email');
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    const handlePengecekanAkun = async () => {
        setIsLoading(true); // Aktifkan loading sebelum melakukan pengecekan
        try {
            const response = await axios.get(`${backendUrl}/pengecekan`);
            console.log(response.data); // Log response for confirmation message
        } catch (error) {
            console.error('Error saat melakukan pengecekan:', error);
        } finally {
            setIsLoading(false); // Nonaktifkan loading setelah pengecekan selesai
        }
    };

    const handleRefresh = () => {
        setIsRefreshing(true); // Aktifkan refreshing sebelum fetch data
        if (selectedOption === 'pengguna') {
            fetchAllUsers();
        } else if (selectedOption === 'tampilkan-email') {
            fetchAllCheckingEmails();
        }
        setIsRefreshing(false); // Nonaktifkan refreshing setelah fetch data selesai
    };

    const handleLogout = async () => {
        try {
            await axios.delete(`${backendUrl}/keluar`);
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const renderPenggunaTable = () => (
        <div className="admin-table-custom">
            <h2>Data Pengguna</h2>
            <table className="table-custom">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama Pengguna</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((user, index) => (
                        <tr key={user.id}>
                            <td className="text-center">{index + 1}</td>
                            <td className="text-left">{user.fullname}</td>
                            <td className="text-center">{user.email}</td>
                            <td className="text-center">{user.status === 1 ? 'Aktif' : 'Nonaktif'}</td>
                            <td className="text-center">
                                <button className="btn-custom btn-activate-custom" onClick={() => handleActivateUser(user.id)}>Activate</button>
                                <button className="btn-custom btn-deactivate-custom" onClick={() => handleDeactivateUser(user.id)}>Deactivate</button>
                                <button className="btn-custom btn-delete-custom" onClick={() => handleDeleteAkun(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderAkunTable = () => {
        const transformKurunWaktu = (value) => {
            switch (value) {
                case 1:
                    return '15 hari';
                case 2:
                    return '30 hari';
                case 3:
                    return '45 hari';
                default:
                    return 'Tidak diketahui';
            }
        };

        return (
            <div className="admin-table-custom">
                <h2>Data Akun</h2>
                <button className="btn-custom btn-pengecekan-custom" onClick={handlePengecekanAkun}>
                    {isLoading ? 'Sedang Memproses...' : 'Lakukan Pengecekan'}
                </button>
                <button className="btn-custom btn-refresh-custom" onClick={handleRefresh} disabled={isLoading}>
                    {isRefreshing ? 'Refreshing...' : <FontAwesomeIcon icon={faSync} />}
                </button>
                <table className="table-custom">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Email</th>
                            <th>Rasio Waktu Pengecekan</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((account, index) => (
                            <tr key={account.id} className={account.status === 1 ? 'status-not-checked' : 'status-checked'}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">{account.value}</td>
                                <td className="text-center">{transformKurunWaktu(account.kurun_waktu)}</td>
                                <td className="text-center">{account.status === 1 ? 'Belum dilakukan pengecekan' : 'Sudah dilakukan pengecekan'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="admin-page-custom">
            <div className="button-wrapper">
                <button className="btn-custom btn-lihat-custom" onClick={() => handleSelectOption('pengguna')}>Lihat Data Pengguna</button>
                <button className="btn-custom btn-lihat-custom" onClick={() => handleSelectOption('tampilkan-email')}>Lihat Data Akun</button>
                <button className="btn-custom btn-logout-custom" onClick={handleLogout}>Keluar</button>
            </div>
            {selectedOption === 'pengguna' && renderPenggunaTable()}
            {selectedOption === 'tampilkan-email' && renderAkunTable()}
        </div>
    );
};

export default AdminPage;
