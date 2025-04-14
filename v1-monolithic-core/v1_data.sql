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
  `role` VARCHAR(255) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Tabla de  usuarios
CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firstName` VARCHAR(255) NOT NULL,
  `lastName` VARCHAR(255) NOT NULL,
  `nationalId` VARCHAR(255) DEFAULT NULL,
  `passport` VARCHAR(255) DEFAULT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `phoneNumber` VARCHAR(15),
  `address` VARCHAR(15),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Tabla para recuperar contraseña
CREATE TABLE `token_recovery` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `user_token_recovery` VARCHAR(255) NOT NULL,
  `token_used` BOOLEAN NOT NULL DEFAULT FALSE, 
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Añadir restricciones de clave foránea
-- --------------------------------------------------------

-- Relacion entre `token_recovery` y users
ALTER TABLE `token_recovery`
  ADD CONSTRAINT `fk_token_recovery__users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;


-- --------------------------------------------------------
--  DATOS DE PRUEBA (FAKE)
-- --------------------------------------------------------
INSERT INTO admin (user, email, password, role) VALUES
('admin', 'admin@example.com', '$2a$10$xJwL5vYRXZ2XMjp4C7h.Be5JzJQ9T0u7Hn7Jk8bXnJt6d1VYvWQ1K', 'admin');

INSERT INTO users (firstName, lastName, email, password, nationalId, passport, phoneNumber, address) VALUES
('Juan', 'Pérez', 'juan.perez@example.com', '$2a$10$3mXq3z2V1t6W9Z8Y7XrRtOeQvL9VkR6wYt0dDn1cBn2fKs7NlWQ3Dm', '123456789', '12345678n', '123456789', 'fakeAddress'),
('María', 'Gómez', 'maria.gomez@example.com', '$2a$10$7pQw2X1t6W9Z8Y7XrRtOeQvL9VkR6wYt0dDn1cBn2fKs7NlWQ3Dm', '123456789', '12345678n', '123456789', 'fakeAddress');


