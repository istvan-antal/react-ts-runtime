@Library('pipeline') _

properties([
    buildDiscarder(
        logRotator(
            artifactDaysToKeepStr: '10',
            artifactNumToKeepStr: '10',
            daysToKeepStr: '10',
            numToKeepStr: '10'
        )
    ),
    disableConcurrentBuilds()
])

node('nodejs') {
    
    dir('build') {
        stage('checkout') {
            checkout scm
        }

        stage('npm install') {
            useNodeJs()
            sh "npm install"
        }

        stage('test') {
            sh "npm test"
        }

        stage('build') {
            sh "npm run build"
        }

        stage('build demos') {
            dir('demos/single-page-react') {
                sh 'npm install'
                sh 'npm run build'
            }
        }
    }
    cleanWs()
}