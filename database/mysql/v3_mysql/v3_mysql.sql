-- TO DO  CREATE INDEX idx_usuarios_nombre ON usuarios(first_name); y CREATE INDEX idx_usuarios_apellido ON usuarios(last_name); 
-- o para busquedas combinadas CREATE INDEX idx_usuarios_nombre_completo ON usuarios(first_name, last_name);

DROP DATABASE IF EXISTS v3_data;
CREATE DATABASE v3_data 
  DEFAULT CHARACTER SET utf8mb4 
  DEFAULT COLLATE utf8mb4_unicode_ci;
USE v3_data;
SET time_zone = "+00:00";

-- Tabla de roles
CREATE TABLE `roles` (
  `id` TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_roles_name` (`name`)
) ENGINE=InnoDB;

-- Tabla de usuarios
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) COLLATE utf8mb4_bin NOT NULL,
  `phone` VARCHAR(20),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_email` (`email`),
  INDEX `idx_users_name` (`first_name`, `last_name`)
) ENGINE=InnoDB;

-- Tabla de tipos de documentos
CREATE TABLE `document_types`(
  `id` TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_document_type` (`name`)
) ENGINE=InnoDB;

-- Tabla de relacion usuario-documento (muchos a muchos)
CREATE TABLE `user_identifications` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `document_type_id` TINYINT UNSIGNED NOT NULL,
  `number` VARCHAR(50) NOT NULL,
  `verified` BOOLEAN DEFAULT FALSE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_identifications_user_type` (`user_id`, `document_type_id`),
  UNIQUE KEY `uk_identifications_type_number` (`document_type_id`, `number`),
  CONSTRAINT `fk_identifications_user` FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_identifications_type` FOREIGN KEY (`document_type_id`)
    REFERENCES `document_types` (`id`)
) ENGINE=InnoDB;

-- Tabla de direcciones
CREATE TABLE `addresses` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `street` VARCHAR(255) NOT NULL,
  `number` VARCHAR(20),
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `postal_code` VARCHAR(20),
  `country` VARCHAR(100) DEFAULT 'Argentina',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_addresses_location` (`state`, `city`),
  CONSTRAINT `fk_addresses_user` FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabla de relación usuarios-roles (muchos a muchos)
CREATE TABLE `user_roles` (
  `user_id` INT UNSIGNED NOT NULL,
  `role_id` TINYINT UNSIGNED NOT NULL,
  `assigned_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `role_id`),
  CONSTRAINT `fk_user_roles_user` FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_roles_role` FOREIGN KEY (`role_id`) 
    REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabla de tokens de recuperación
CREATE TABLE `password_reset_tokens` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `token_recovery` VARCHAR(255) COLLATE utf8mb4_bin NOT NULL,
  `is_used` BOOLEAN DEFAULT FALSE,
  `used_at` DATETIME NULL DEFAULT NULL,
  `expires_at` DATETIME NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_reset_tokens_token` (`token_hash`),
  CONSTRAINT `fk_reset_tokens_user` FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Datos iniciales roles
INSERT INTO `roles` (`name`, `description`) VALUES
('admin', 'Administrador del sistema con acceso completo'),
('user', 'Usuario estándar del sistema'),
('manager', 'Usuario con privilegios de gestión');

-- Datos iniciales tipos de documentos
INSERT INTO `document_types` (`name`, `description`) VALUES
('dni', 'Documento Nacional de Identidad'),
('passport', 'Pasaporte internacional');

-- Usuario admin por defecto
INSERT INTO `users` (`first_name`, `last_name`, `email`, `password_hash`) VALUES
('Admin', 'System', 'admin@example.com', '$2a$10$xJwL5vYRXZ2XMjp4C7h.Be5JzJQ9T0u7Hn7Jk8bXnJt6d1VYvWQ1K');

-- Asignar rol admin al primer usuario
INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
(1, 1);
