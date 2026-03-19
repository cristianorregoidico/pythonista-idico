export const PYTHON_VERSIONS = [
  "Python 2.7",
  "Python 3.5",
  "Python 3.6",
  "Python 3.7",
  "Python 3.8",
  "Python 3.9",
  "Python 3.10",
  "Python 3.11",
  "Python 3.12",
  "Python 3.13",
] as const;

export const PYTHON_TECHNOLOGIES = [
  "Django",
  "FastAPI",
  "Flask",
  "Pydantic",
  "SQLAlchemy",
  "Pandas",
  "NumPy",
  "Scikit-Learn",
  "PyTorch",
  "TensorFlow",
  "Polars",
  "Poetry",
] as const;

export const PYTHON_TECHNOLOGY_LOGOS: Record<(typeof PYTHON_TECHNOLOGIES)[number], string> = {
  Django: "https://cdn.simpleicons.org/django/44B78B",
  FastAPI: "https://cdn.simpleicons.org/fastapi/009688",
  Flask: "https://cdn.simpleicons.org/flask/FFFFFF",
  Pydantic: "https://cdn.simpleicons.org/pydantic/E92063",
  SQLAlchemy: "https://cdn.simpleicons.org/sqlalchemy/D71F00",
  Pandas: "https://cdn.simpleicons.org/pandas/150458",
  NumPy: "https://cdn.simpleicons.org/numpy/4DABCF",
  "Scikit-Learn": "https://cdn.simpleicons.org/scikitlearn/F7931E",
  PyTorch: "https://cdn.simpleicons.org/pytorch/EE4C2C",
  TensorFlow: "https://cdn.simpleicons.org/tensorflow/FF6F00",
  Polars: "https://cdn.simpleicons.org/polars/CD792C",
  Poetry: "https://cdn.simpleicons.org/poetry/60A5FA",
};

export const MAX_UPLOAD_SIZE = 2 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
