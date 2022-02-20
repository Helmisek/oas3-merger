export class AppError extends Error {
  constructor(message: string) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
  }
}

export class WrongInputPathError extends AppError {}

export class WrongConfigurationFileError extends AppError {}

export class EmptyConfigurationFileError extends AppError {}

export class NoSpecificationsFilesFoundError extends AppError {
  constructor(fileExtensions: string, dirPath: string) {
    super(`No [${fileExtensions}] specs found in ${dirPath}.`)
  }
}

export class NoComponentKeysFoundError extends AppError {
  constructor() {
    super('No *component* sub-keys were defined for *components* schema.')
  }
}

export class NoPathKeysFoundError extends AppError {
  constructor() {
    super('No *path* sub-keys were defined for *paths* schema.')
  }
}

export class NoSpecificationsFoundError extends AppError {
  constructor() {
    super(
      'No specification keys (components nor paths) were found in provided spec files.',
    )
  }
}
