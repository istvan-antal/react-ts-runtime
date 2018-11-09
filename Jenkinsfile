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

def demos = [
    'single-page-react', 'server-side-rendering', 'redux-typescript', 'wasm'
];

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

        demos.each{ v -> 
            stage("build demos/${v}") {
                dir("demos/${v}") {
                    sh 'npm install'
                    if (v == "wasm") {
                        sh 'source ~/emsdk/emsdk_env.sh; npm run build'
                    } else {
                        sh 'npm run build'
                    }
                }
            }
        }
    }
    cleanWs()
}