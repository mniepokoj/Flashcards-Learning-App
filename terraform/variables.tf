variable "project_id" {
  description = "Project ID"
  type        = string
  default     = "flashcards-learning-app"
}

variable "terraform_state" {
  description = "Name of the cloud storage bucket for terraform state"
  type        = string
  default     = "flashcard_learning_app_bucket_terraform"
}

variable "source_name" {
  description = "Name of the source zip file"
  type        = string
  default     = "src.zip"
}

variable "code_bucket" {
  description = "Name of the cloud storage bucket for source code"
  type        = string
  default     = "flashcard-learning-app-source-bucket"
}

variable "version_id" {
  description = "Version ID of App Engine Standard Application"
  type        = string
  default     = "1"
}