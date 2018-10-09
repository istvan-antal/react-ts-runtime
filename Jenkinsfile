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
    useNodeJs('10.11.0', '6.4.1')
    
    dir('build') {
        stage('checkout') {
            checkout scm
        }

        stage('npm install') {
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