DROP DATABASE IF EXISTS v1_data ;
CREATE DATABASE IF NOT EXISTS v1_data;
USE v1_data;
SET time_zone = "+00:00";


-- --------------------------------------------------------
-- Tablas
-- --------------------------------------------------------

-- Tabla admin
CREATE TABLE `admin` (
  `id` INT NOT NULL AUTO_INCREMENT  ,
  `user` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `rol` VARCHAR(255) NOT NULL,
  `fecha_creacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Tabla  usuarios
CREATE TABLE `usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `apellido` VARCHAR(255) NOT NULL,
  `dni` VARCHAR(255) DEFAULT NULL,
  `pasaporte` VARCHAR(255) DEFAULT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `telefono` VARCHAR(15),
  `direccion` VARCHAR(15),
  `fecha_creacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Tabla token_recovery para recuperar contraseña
CREATE TABLE `token_recovery` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` INT NOT NULL,
  `user_token_recovery` VARCHAR(255) NOT NULL,
  `token_used` BOOLEAN NOT NULL DEFAULT FALSE, 
  `fecha_creacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Añadir restricciones de clave foránea
-- --------------------------------------------------------

-- Relacion entre `token_recovery` y usuarios
ALTER TABLE `token_recovery`
  ADD CONSTRAINT `fk_token_recovery__usuarios` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;


-- --------------------------------------------------------
--  DATOS DE PRUEBA (FAKE)
-- --------------------------------------------------------
INSERT INTO admin (user, email, password, rol) VALUES
('admin', 'admin@example.com', '$2a$10$xJwL5vYRXZ2XMjp4C7h.Be5JzJQ9T0u7Hn7Jk8bXnJt6d1VYvWQ1K', 'admin');

INSERT INTO usuarios (nombre, apellido, email, password) VALUES
('Juan', 'Pérez', 'juan.perez@example.com', '$2a$10$3mXq3z2V1t6W9Z8Y7XrRtOeQvL9VkR6wYt0dDn1cBn2fKs7NlWQ3Dm'),
('María', 'Gómez', 'maria.gomez@example.com', '$2a$10$7pQw2X1t6W9Z8Y7XrRtOeQvL9VkR6wYt0dDn1cBn2fKs7NlWQ3Dm');


