import sys
import random
from PyQt6.QtCore import Qt, QTimer
from PyQt6.QtWidgets import QApplication, QSystemTrayIcon, QMenu, QStyle
from PyQt6.QtGui import QIcon, QPixmap, QPainter, QColor, QFont, QAction

class AntigravityTrayApp:
    def __init__(self, app):
        self.app = app
        
        # Inisialisasi System Tray
        self.tray_icon = QSystemTrayIcon()
        
        # Buat ikon secara programatik agar tidak butuh file eksternal
        self.tray_icon.setIcon(self.create_icon())
        self.tray_icon.setVisible(True)
        
        # Buat Context Menu
        self.menu = QMenu()
        
        # Menu Item: Menampilkan Token (dinamis)
        self.usage_action = QAction("Loading tokens...")
        self.usage_action.setEnabled(False) # Dibuat disable karena hanya untuk info
        self.menu.addAction(self.usage_action)
        
        self.menu.addSeparator()
        
        # Menu Item: Quit
        self.quit_action = QAction("Quit")
        self.quit_action.triggered.connect(self.app.quit)
        self.menu.addAction(self.quit_action)
        
        # Set Menu ke Tray
        self.tray_icon.setContextMenu(self.menu)
        
        # Setup Timer for Auto-Refresh (setiap 5 detik untuk demo)
        self.timer = QTimer()
        self.timer.timeout.connect(self.fetch_usage_data)
        self.timer.start(5000)
        
        # Initial Fetch
        self.fetch_usage_data()

    def create_icon(self):
        """Membuat ikon simpel berupa lingkaran dengan huruf 'A' di tengahnya"""
        pixmap = QPixmap(64, 64)
        pixmap.fill(Qt.GlobalColor.transparent)
        
        painter = QPainter(pixmap)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)
        
        # Gambar background lingkaran (Warna Ungu/Biru)
        painter.setBrush(QColor(138, 43, 226)) # BlueViolet
        painter.setPen(Qt.PenStyle.NoPen)
        painter.drawEllipse(4, 4, 56, 56)
        
        # Tulis huruf 'A'
        painter.setPen(QColor("white"))
        font = QFont("Arial", 32, QFont.Weight.Bold)
        painter.setFont(font)
        painter.drawText(pixmap.rect(), Qt.AlignmentFlag.AlignCenter, "A")
        
        painter.end()
        return QIcon(pixmap)

    def fetch_usage_data(self):
        """
        MOCK FETCH FUNCTION
        Ganti logika ini dengan pemanggilan API jika endpoint sudah tersedia.
        e.g., response = requests.get('YOUR_API_URL', headers={'Authorization': 'Bearer YOUR_TOKEN'})
        """
        mock_limit = 1000000
        # Tambah usage secara random untuk simulasi
        current_usage = getattr(self, 'current_mock_usage', 450000)
        current_usage += random.randint(100, 5000)
        if current_usage > mock_limit:
            current_usage = 0
            
        self.current_mock_usage = current_usage
        
        text = f"{current_usage:,} / {mock_limit:,} Tokens"
        
        # Update Tooltip (muncul saat di-hover)
        self.tray_icon.setToolTip(f"Antigravity Usage:\n{text}")
        
        # Update teks di dalam menu
        self.usage_action.setText(text)

if __name__ == '__main__':
    app = QApplication(sys.argv)
    
    # Pastikan aplikasi tidak ditutup otomatis kalau window ditutup (karena tidak ada window)
    app.setQuitOnLastWindowClosed(False)
    
    tray_app = AntigravityTrayApp(app)
    sys.exit(app.exec())
