
pipeline {
    agent any

    triggers {
        pollSCM('H/2 * * * *')
    }

    stages {
        stage('Install') {
            steps {
                bat 'node --version'
                bat 'npm --version'
                bat 'npm ci --prefix frontend'
            }
        }

        stage('Test') {
            steps {
                bat 'npm --prefix frontend test'
            }
        }

        stage('Build') {
            steps {
                bat 'npm --prefix frontend run build'
            }
        }
    }

    post {
        success {
            echo 'StudySphere frontend CI completed successfully!'
        }
        failure {
            echo 'StudySphere frontend CI failed.'
        }
    }
}
