-- DROP DATABASE proyecto_fed;

CREATE DATABASE IF NOT EXISTS proyecto_fed;
USE proyecto_fed;

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
  `direccion` INT,
  `fecha_creacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Tabla token_recovery para recuperar contraseña
CREATE TABLE `token_recovery` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` INT NOT NULL,
  `user_token_recovery` VARCHAR(255) NOT NULL,
  `fecha_creacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- TO DO Tabla roles

-- TO DO Tabla direccion descompesta



-- --------------------------------------------------------
-- Añadir restricciones de clave foránea
-- --------------------------------------------------------

-- Relacion entre `token_recovery` y usuarios
ALTER TABLE `token_recovery`
  ADD CONSTRAINT `fk_token_recovery__usuarios` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;



-- --------------------------------------------------------
-- Mostrar indices de tabla
-- --------------------------------------------------------

SHOW INDEX FROM usuarios;
SHOW INDEX FROM token_recovery;
