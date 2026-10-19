pipeline {
    agent any

    stages {
        stage('Install') {
            steps {
                bat 'make install'
            }
        }

        stage('Test') {
            steps {
                bat 'make test'
            }
        }

        stage('Build') {
            steps {
                bat 'make build'
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
