import sys
import random
from PyQt6.QtCore import Qt, QTimer, QPoint
from PyQt6.QtWidgets import QApplication, QWidget, QVBoxLayout, QLabel, QProgressBar
from PyQt6.QtGui import QFont, QColor
import requests

class AntigravityWidget(QWidget):
    def __init__(self):
        super().__init__()
        self.initUI()
        
        # Setup Timer for Auto-Refresh (every 5 seconds for demo)
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.fetch_usage_data)
        self.timer.start(5000)
        
        # Initial Fetch
        self.fetch_usage_data()

    def initUI(self):
        # Frameless Window, Stays on Bottom (like a desktop widget), Tool (hides from taskbar usually)
        self.setWindowFlags(
            Qt.WindowType.FramelessWindowHint | 
            Qt.WindowType.WindowStaysOnTopHint
        )
        self.setAttribute(Qt.WidgetAttribute.WA_TranslucentBackground)
        
        self.resize(300, 150)

        # Layout
        self.layout = QVBoxLayout(self)
        self.layout.setContentsMargins(20, 20, 20, 20)

        # Background Frame styling (Glassmorphism look)
        self.setStyleSheet("""
            QWidget {
                background-color: rgba(25, 25, 30, 220);
                border-radius: 15px;
                border: 1px solid rgba(255, 255, 255, 30);
                color: white;
            }
        """)

        # Title Label
        self.title_label = QLabel("Antigravity Usage")
        self.title_label.setFont(QFont("Inter", 14, QFont.Weight.Bold))
        self.title_label.setStyleSheet("background-color: transparent; border: none;")
        self.layout.addWidget(self.title_label)

        # Usage Text Label
        self.usage_label = QLabel("Loading tokens...")
        self.usage_label.setFont(QFont("Inter", 11))
        self.usage_label.setStyleSheet("background-color: transparent; border: none; color: #a0a0a0;")
        self.layout.addWidget(self.usage_label)

        # Progress Bar
        self.progress_bar = QProgressBar()
        self.progress_bar.setFixedHeight(8)
        self.progress_bar.setTextVisible(False)
        self.progress_bar.setStyleSheet("""
            QProgressBar {
                border: none;
                border-radius: 4px;
                background-color: rgba(255, 255, 255, 20);
            }
            QProgressBar::chunk {
                border-radius: 4px;
                background-color: qlineargradient(x1: 0, y1: 0, x2: 1, y2: 0, stop: 0 #8A2BE2, stop: 1 #00BFFF);
            }
        """)
        self.layout.addWidget(self.progress_bar)

        # Status / Refreshing indicator
        self.status_label = QLabel("Last updated: Just now")
        self.status_label.setFont(QFont("Inter", 9))
        self.status_label.setStyleSheet("background-color: transparent; border: none; color: #606060;")
        self.layout.addWidget(self.status_label)

        # Variables for dragging the frameless window
        self.old_pos = None

    def fetch_usage_data(self):
        """
        MOCK FETCH FUNCTION
        Replace this logic with an actual API call once the endpoint is available.
        e.g., response = requests.get('YOUR_API_URL', headers={'Authorization': 'Bearer YOUR_TOKEN'})
        """
        # --- MOCK DATA GENERATION ---
        mock_limit = 1000000
        # Randomly increment usage to simulate real-time activity
        current_usage = getattr(self, 'current_mock_usage', 450000)
        current_usage += random.randint(100, 5000)
        if current_usage > mock_limit:
            current_usage = 0
            
        self.current_mock_usage = current_usage
        
        # Update UI
        percent = int((current_usage / mock_limit) * 100)
        self.progress_bar.setValue(percent)
        self.usage_label.setText(f"{current_usage:,} / {mock_limit:,} Tokens used")
        self.status_label.setText("Updated automatically")

    # Mouse events to allow dragging the borderless window
    def mousePressEvent(self, event):
        if event.button() == Qt.MouseButton.LeftButton:
            self.old_pos = event.globalPosition().toPoint()

    def mouseMoveEvent(self, event):
        if self.old_pos is not None:
            delta = QPoint(event.globalPosition().toPoint() - self.old_pos)
            self.move(self.x() + delta.x(), self.y() + delta.y())
            self.old_pos = event.globalPosition().toPoint()

    def mouseReleaseEvent(self, event):
        self.old_pos = None

if __name__ == '__main__':
    app = QApplication(sys.argv)
    
    # Optional: Set global application font
    font = QFont("Inter", 10)
    app.setFont(font)
    
    widget = AntigravityWidget()
    widget.show()
    sys.exit(app.exec())
