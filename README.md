  # API Evolution Suite 

**Un viaje práctico a través de diferentes arquitecturas backend, desde un CRUD monolítico hasta sistemas escalables con patrones modernos.**

## Visión General
Proyecto educativo que explora la evolución de una API REST a través de distintas arquitecturas backend. El objetivo principal es demostrar la progresión desde enfoques simples hasta patrones arquitectónicos avanzados, aplicando mejores prácticas y principios de diseño en cada iteración.

### **Principios y Patrones Cubiertos**
- **Arquitecturas**: Monolítica → MVC → Servicios → SOLID → Clean Architecture
- **Seguridad**: JWT → OAuth2 → Bcrypt → Middlewares de autenticación
- **Calidad de Código**: Testing → Logging → Documentación → Inyección de Dependencias
- **Patrones de Diseño**: Repository Pattern → Factory → Decorators

## Stack Tecnológico Principal
**Backend:** Node.js · Express · TypeScript  
**Bases de Datos:** MySQL · MongoDB  
**Herramientas:** Winston · Swagger · Jest · Docker  
**Autenticación:** JWT · Passport · Bcrypt

## Versiones y Evolución Arquitectónica

Cada versión representa un escalón en la madurez arquitectónica:

| Versión | Estado | Enfoque Arquitectónico | Tecnologías Clave |
|---------|--------|------------------------|-------------------|
| [v1 - Monolithic Core](/v1-monolithic-core) | ✅ Completada | Single-file CRUD | Node.js, Express, MySQL |
| [v2 - Modular Nexus](/v2-modular-nexus) | ✅ Completada | MVC + Middlewares | Bcrypt, Passport, Validator |
| [v3 - ServiceCore](/v3-service-core) | 🚧 En desarrollo | Servicio, Model | JWT, Nodemailer |
| [v4 - SecureDoc](/v4-securedoc) | 📅 Planeada | Logger + Swagger + Testing | Winston, Jest, Swagger UI |
| [v5 - SolidCore](/v5-solidcore) | 📅 Planeada | SOLID + Repository Pattern | Inversify, DI |
| [v6 - TypeCraft](/v6-typecraft) | 📅 Planeada | TypeScript + Decorators | TypeORM, TSConfig |

