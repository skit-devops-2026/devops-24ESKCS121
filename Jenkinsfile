pipeline {
    agent any

    stages {
        stage('Install') {
            steps {
                sh 'make install'
            }
        }

        stage('Test') {
            steps {
                sh 'make test'
            }
        }

        stage('Build') {
            steps {
                sh 'make build'
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
