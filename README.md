![image](https://github.com/user-attachments/assets/32f1a809-fda3-4010-addd-addd0cc639a9)

# Trivial

**Trivial** is a freelance application developed as a pet project. It leverages Django for backend development and incorporates Docker for containerization. The application includes features such as real-time chat functionality and user authentication.

## Features

- **User Authentication**: Secure user registration and login system.
- **Real-time Chat**: Interactive chat rooms enabling instant messaging between users.
- **Dockerized Setup**: Containerized environment for consistent development and deployment.

## Technologies Used

- **Backend**: Django (Python)
- **Containerization**: Docker, Docker Compose
- **Database**: PostgreSQL
- **Frontend**: HTML, CSS, JavaScript

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/shwballl/Trivial.git
   cd Trivial
   ```

2. **Build and run the Docker containers**:

   ```bash
   docker-compose up --build
   ```


3. **Apply migrations**:

   ```bash
   docker-compose exec web python manage.py migrate
   ```


4. **Create a superuser (optional)**:

   ```bash
   docker-compose exec web python manage.py createsuperuser
   ```


5. **Access the application**:

   Open your browser and navigate to `http://localhost:8000/`

## Project Structure


```plaintext
Trivial/
├── apps/
│   ├── chat/          # Chat application
│   └── users/         # User management
├── templates/         # HTML templates
├── static/            # Static files (CSS, JS, images)
├── docker/            # Docker-related configurations
├── manage.py          # Django's command-line utility
├── Dockerfile         # Docker image configuration
├── docker-compose.yml # Docker Compose configuration
└── requirements/      # Python dependencies
```


## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Developed as a personal project to explore Django and Docker integration.
- Inspired by the need for a simple freelance application with real-time communication features.

---
