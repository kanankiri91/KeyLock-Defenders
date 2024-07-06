import PwdImage from "../src/assets/pencegahan/1.jpg"
import TwoFactor from "../src/assets/pencegahan/2FA.jpg"
import AppPermission from "../src/assets/pencegahan/app-permission.png"
import DeletedEmail from "../src/assets/pencegahan/delete-email.png"
import PhishingImage from "../src/assets/pencegahan/phishing.jpg"
import UpdateSoftwareImage from "../src/assets/pencegahan/softwareUpdate.jpg"
import EmailSharingImage from "../src/assets/pencegahan/email-sharing.png"
import MediaAutentikasi from "../src/assets/pencegahan/media-autentikasi.jpg"
import BackUpDataEmail from "../src/assets/pencegahan/backup-data-email.jpg"

export const navLinks = [
    {
      id: 1,
      path: "beranda",
      text: "Beranda",
    },
    {
      id: 2,
      path: "password",
      text: "Periksa Password",
    },
    {
      id: 3,
      path: "url",
      text: "Periksa URL",
    },
    {
      id: 4,
      path: "alertme",
      text: "Notifikasi",
    },{
      id: 5,
      path: "about",
      text: "About",
    },
  ];

  export const semua = [
    {
        id: 1,
        image: PwdImage,
        title: "Gunakan Password yang Kuat",
        desc: "Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol untuk membuat password yang kuat dan sulit ditebak.",
        buy: "Lihat Lebih",
        delay: "300",
        url: "https://www.youtube.com/",
    },
    {
        id: 2,
        image: PhishingImage,
        title: "Jaga Kewaspadaan Terhadap Phishing",
        desc: "Waspadai email yang mencurigakan dan jangan klik tautan atau lampiran dari pengirim yang tidak dikenal.",
        buy: "Lihat Lebih",
        delay: "600",
        url: "",
      },
    {
        id: 3,
        image: TwoFactor,
        title: "Aktifkan Verifikasi Dua Langkah",
        desc: "Tambahkan lapisan keamanan ekstra dengan mengaktifkan verifikasi dua langkah untuk melindungi akun emailmu.",
        buy: "Lihat Lebih",
        delay: "900",
        url: "",
      },
    {
        id: 4,
        image: UpdateSoftwareImage,
        title: "Perbarui Perangkat Lunak Secara Berkala",
        desc: "Pastikan perangkat lunak keamananmu selalu terbaru untuk melindungi email dari ancaman yang baru.",
        buy: "Lihat Lebih",
        delay: "",
        url: "",
      },
    {
        id: 5,
        image: EmailSharingImage,
        title: "Hati-hati Saat Berbagi Email",
        desc: "Pilih dengan hati-hati situs atau layanan yang meminta alamat emailmu, dan hindari berbagi emailmu secara terbuka.",
        buy: "Lihat Lebih",
        delay: "300",
        url: "",
      },
    {
        id: 6,
        image: AppPermission,
        title: "Periksa dan Batasi Izin Aplikasi Pihak Ketiga",
        desc: "Secara berkala periksa dan batasi izin aplikasi pihak ketiga yang terhubung dengan akun emailmu.",
        buy: "Lihat Lebih",
        delay: "600",
        url: "",
      },
    {
        id: 7,
        image: DeletedEmail,
        title: "Hapus Email yang Tidak Diperlukan",
        desc: "Hapus email yang tidak diperlukan atau sensitif secara teratur untuk mengurangi risiko kebocoran data.",
        buy: "Lihat Lebih",
        delay: "300",
        url: "",
      },
    {
        id: 8,
        image: MediaAutentikasi,
        title: "Jangan Gunakan Email Saja Sebagai Media Autentikasi",
        desc: "Hindari menggunakan email sebagai satu-satunya metode autentikasi. Gunakan opsi lain seperti verifikasi SMS atau aplikasi autentikasi.",
        buy: "Lihat Lebih",
        delay: "600",
        url: "",
      },
    {
        id: 9,
        image: BackUpDataEmail,
        title: "Selalu Backup Data Email Penting",
        desc: "Lakukan backup rutin terhadap data emailmu untuk mengantisipasi kehilangan data akibat serangan atau kegagalan sistem",
        buy: "Lihat Lebih",
        delay: "",
        url: "",
      },
  ];