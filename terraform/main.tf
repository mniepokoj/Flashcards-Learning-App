terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "5.10.0"
    }
  }
}

provider "google" {
  credentials = file("/home/mniepokoj/Flashcards-Learning-App/credentials.json")
  project     = var.project_id
  region      = "europe-central2"  # Możesz dostosować do swojego regionu
}

resource "google_project_service" "crm_api" {
  project            = var.project_id
  service            = "cloudresourcemanager.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "app_engine_api" {
  project            = var.project_id
  service            = "appengine.googleapis.com"
  disable_on_destroy = false
}

# resource "google_app_engine_application" "app" {
#   project       = var.project_id
#   location_id   = "europe-central2"
#   database_type = "CLOUD_FIRESTORE"
#   name        = "flashcards-learning-app-25"
#   lifecycle {
#     prevent_destroy = true
#   }
# }

resource "google_storage_bucket" "terraform_state" {
  name     = var.terraform_state
  project  = var.project_id
  location = "europe-central2"
}


resource "google_app_engine_standard_app_version" "frontend" {
  project          = var.project_id
  version_id       = "frontend-${formatdate("YYYYMMDDHHmmss", timestamp())}"
  service          = "default"
  runtime          = "nodejs20"
  inbound_services = ["INBOUND_SERVICE_WARMUP"]
  entrypoint {
    shell = "cd frontend && npm install && npm start"
  }

  deployment {
    zip {
      source_url = "https://storage.googleapis.com/${var.code_bucket}/frontend.zip"
    }
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "google_app_engine_standard_app_version" "backend" {
  project          = var.project_id
  version_id       = "backend-${formatdate("YYYYMMDDHHmmss", timestamp())}"
  service          = "backend"
  runtime          = "nodejs20"
  inbound_services = ["INBOUND_SERVICE_WARMUP"]

  entrypoint {
    shell = "cd backend && npm instal &&  npm start"
  }
  deployment {
    zip {
      source_url = "https://storage.googleapis.com/${var.code_bucket}/backend.zip"
    }
  }

  lifecycle {
    create_before_destroy = true
  }
}
