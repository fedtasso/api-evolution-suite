DROP DATABASE IF EXISTS v2_mysql ;
CREATE DATABASE IF NOT EXISTS v2_mysql;
USE v2_mysql;
SET time_zone = "+00:00";


-- --------------------------------------------------------
-- Tablas
-- --------------------------------------------------------

-- Tabla de  usuarios
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `national_id` VARCHAR(255) DEFAULT NULL,
  `passport` VARCHAR(255) DEFAULT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `phone_number` VARCHAR(15),
  `address` VARCHAR(15),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Tabla de roles
CREATE TABLE `roles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_roles_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Tabla de relación usuarios-roles (muchos a muchos)
CREATE TABLE `user_roles` (
  `user_id` INT UNSIGNED NOT NULL,
  `role_id` INT UNSIGNED NOT NULL,
  `assigned_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `role_id`),
  CONSTRAINT `fk_user_roles_user` FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_roles_role` FOREIGN KEY (`role_id`) 
    REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Tabla de tokens para recuperación de password
CREATE TABLE `password_reset_tokens` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `token_recovery` VARCHAR(255) COLLATE utf8mb4_bin NOT NULL,
  `is_used` BOOLEAN DEFAULT FALSE,
  `used_at` DATETIME NULL DEFAULT NULL,
  `expires_at` DATETIME NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_reset_tokens_user` FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Datos iniciales roles
INSERT INTO `roles` (`name`, `description`) VALUES
('admin', 'Administrador del sistema con acceso completo'),
('user', 'Usuario estándar del sistema');

-- Usuario admin por defecto
INSERT INTO `users` (`first_name`, `last_name`, `email`, `password`) VALUES
('Admin', 'System', 'admin@example.com', '$2a$10$xJwL5vYRXZ2XMjp4C7h.Be5JzJQ9T0u7Hn7Jk8bXnJt6d1VYvWQ1K');

-- Asignar rol admin al primer usuario
INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
(1, 1);

-- --------------------------------------------------------
--  DATOS DE PRUEBA (FAKE)
-- --------------------------------------------------------

INSERT INTO users (first_name, last_name, national_id, email, password, phone_number, address) VALUES
('Juan', 'Pérez', '123456789', 'juan.perez@example.com', '$2a$10$3mXq3z2V1t6W9Z8Y7XrRtOeQvL9VkR6wYt0dDn1cBn2fKs7NlWQ3Dm', '11112222', 'fake address 1'),
('María', 'Gómez', '987654321', 'maria.gomez@example.com', '$2a$10$7pQw2X1t6W9Z8Y7XrRtOeQvL9VkR6wYt0dDn1cBn2fKs7NlWQ3Dm', '33334444', 'fake address 2');


 