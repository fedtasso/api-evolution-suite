# API Evolution Suite 🚀

[![CI/CD](https://github.com/fedtasso/api-evolution-suite/actions/workflows/main.yml/badge.svg)](https://github.com/fedtasso/api-evolution-suite/actions) 
<!-- TO DO, crear el workflows -->
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Un viaje práctico a través de diferentes arquitecturas backend, desde un CRUD monolítico hasta sistemas escalables con patrones modernos.

## 📌 Tabla de Contenidos
- [Visión General](#-visión-general)
- [Versiones](#-versiones)
- [Instalación](#-instalación)
- [Documentación API](#-documentación-api)  <!-- TO DO completar -->
- [Contribuir](#-contribuir)
- [Roadmap](#-roadmap)
- [Licencia](#-licencia)

## 🚩 Visión General
En este proyecto educativo, exploro la evolución de una API REST a través de distintos enfoques arquitectónicos. Aunque todas las versiones implementan un CRUD básico, el objetivo no es la cantidad de procesos, sino la aplicación de diferentes **arquitecturas** y la progresión del código en cada versión.

✅ **Principios cubiertos**  
- CRUD básico → MVC → Servicios → SOLID  
- Autenticación JWT/OAuth2 → Logging → Testing  
- Inyección de Dependencias → Repository Pattern → TypeScript  

🔧 **Stack tecnológico principal**  
Node.js · Express · MySQL· MongoDB · Winston · Swagger · Docker (v7+)

## 🧩 Versiones
Cada versión representa una etapa en el aprendizaje de arquitectura backend:

| Versión | Nombre              | Características Clave                          | Tecnologías                     |
|---------|---------------------|------------------------------------------------|---------------------------------|
| [v1](/v1-monolithic-core) | Monolithic Core     | Single-file CRUD                               | Node.js, Express, MySQL           |
| [v2](/v2-modular-nexus)   | Modular Nexus       | MVC, Middlewares                               | Bcrypt, Passport, Validator       |
| [v3](/v3-service-core)    | ServiceCore         | Servicios con Clases                           | JWT, Nodemailer                   |
| [v4](/v4-securedoc)       | SecureDoc           | Logger, Swagger, Testing                       | Winston, Jest, Swagger UI, Mongo  |
| [v5](/v5-solidcore)       | SolidCore           | SOLID, Repository Pattern                      | Inversify, DI                     |
| [v6](/v6-typecraft)       | TypeCraft           | TypeScript, Decorators                         | TypeORM, TSConfig                 |

## ⚙️ Instalación
**Requisitos**: Node.js v18+, MongoDB 6+

```bash
# Clonar repositorio
git clone https://github.com/fedtasso/api-evolution-suite.git
cd api-evolution-suite

# Instalar dependencias para una versión específica
cd v5-solidcore && npm install # TO DO revisar

# Configurar entorno (ejemplo)
cp .env.example .env  # TO DO revisar
# api-evolution-