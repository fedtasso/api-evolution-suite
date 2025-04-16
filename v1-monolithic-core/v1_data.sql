DROP DATABASE IF EXISTS v1_data ;
CREATE DATABASE IF NOT EXISTS v1_data;
USE v1_data;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Tablas
-- --------------------------------------------------------

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


-- --------------------------------------------------------
--  DATOS DE PRUEBA (FAKE)
-- --------------------------------------------------------
INSERT INTO users (firstName, lastName, email, password, nationalId, passport, phoneNumber, address) VALUES
('Juan', 'Pérez', 'juan.perez@example.com', '$2a$10$3mXq3z2V1t6W9Z8Y7XrRtOeQvL9VkR6wYt0dDn1cBn2fKs7NlWQ3Dm', '123456789', '12345678n', '123456789', 'fakeAddress'),
('María', 'Gómez', 'maria.gomez@example.com', '$2a$10$7pQw2X1t6W9Z8Y7XrRtOeQvL9VkR6wYt0dDn1cBn2fKs7NlWQ3Dm', '123456789', '12345678n', '123456789', 'fakeAddress');


