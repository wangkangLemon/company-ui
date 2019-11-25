export default function (ossOption, changeToken) {
    if (ossOption) {
        ossOption.accessKeyId = ossOption.accessKeyId
        ossOption.accessKeySecret = ossOption.accessKeySecret
        ossOption.stsToken = ossOption.securityToken
        ossOption.bucket = ossOption.bucketName
        ossOption.region = ossOption.region
        ossOption.secure = location.protocol === 'https:'
        // region: 'oss-cn-beijing',
        //     accessKeyId: 'STS.FAHYC9xQu9hULJpFaZLJ1LFSo',
        //     accessKeySecret: 'F6Mn61wJpWXydKY6L9nCHfbQYBhKqP9ufBxirwqNrfSu',
        //     stsToken: 'CAIS9QF1q6Ft5B2yfSjIp4L9EvmNlY5Ujqq\x2bTmzBomEPQMUdo4P4jTz2IHtFenFvAO8WsPw2mmFT7PcZlqF6R5pEQ3uVMJOtWWuxL0DzDbDasumZsJYm6vT8a0XxZjf\/2MjNGZabKPrWZvaqbX3diyZ32sGUXD6\x2bXlujQ\/br4NwdGbZxZASjaidcD9p7PxZrrNRgVUHcLvGwKBXn8AGyZQhKwlMm0Dslt\/nkmJTEsUqO1wTAp7VL99irEP\x2bNdNJxOZpzadCx0dFte7DJuCwqsEMbqv8p1fMUp2\x2be4IDGWQgK\x2bXOXKPbK89FiKxJhYq8zF77DAz1AUAKD0BqAAbNwaudwLzy5hfjzPzE6mTgSc\x2bndCdh24s1NjN93YJrg3RqjNtuqmi1jvtQp5vAHXHcd5qGNbxcrqxQA7oVlnMXwC87ZAb\/mIOtUH4I2HdOM4NuPfVaohDfwCmByymk7XqdYSECB\x2btHrThyUhSILr9dWJo98JTFGwO3KSd7G2rtH',
        //     bucket: 'yst-vod',
        //     secure: location.protocol === 'https:'
    }

    var client = window.OSS && new OSS.Wrapper(ossOption)
    var checkPointIndexes = {}
    var _this = this

    if (!window.OSS) {
        new Promise((resolve, reject) => {
            let script = document.createElement('script')
            script.src = '//gosspublic.alicdn.com/aliyun-oss-sdk.min.js'
            document.head.appendChild(script)
            script.onload = () => {
                resolve(true)
            }
        }).then(() => {
            client = new OSS.Wrapper(ossOption)
        })
    }

    function saveCheckPoint (file, checkpoint) {
        var key = _this.getFileKey(file)
        checkPointIndexes[key] = checkpoint
        window.localStorage.setItem(key, JSON.stringify(checkpoint))
    }

    function deleteCheckPoint (file) {
        var key = _this.getFileKey(file)
        window.localStorage.removeItem(key)
    }

    function getCheckPoint (file) {
        var key = _this.getFileKey(file)
        var checkpoint = window.localStorage.getItem(key)
        checkpoint && (checkpoint = JSON.parse(checkpoint))
        checkpoint || (checkpoint = {})
        checkpoint.file = file
        return checkpoint
    }

    // 获取文件上传唯一标记
    this.getFileKey = function (file) {
        return 'aliyun.oss.multipartUpload.' + [
            file.name,
            file.type,
            file.size,
            file.lastModified || '',
            file.webkitRelativePath || ''
        ].join('|')
    }

    // 上传文件
    this.uploadFile = function (name, file, progress, success, error) {
        var checkpoint = getCheckPoint(file) || {}
        checkpoint.file = file
        client.multipartUpload(name, file, {
            partSize: 256 * 1024,
            checkpoint: checkpoint,
            progress: function (pgs, cpt) {
                return function (done) {
                    progress && progress(Math.floor(pgs * 100))
                    saveCheckPoint(file, cpt)
                    done()
                }
            }
        }).then(function (ret) {
            deleteCheckPoint(file)
            success && success(ret)
        }).catch(function (err) {
            console.info('oss出错1' + err)
            // 如果是授权过期则自动更换授权
            if (['AccessDenied', 'InvalidAccessKeyId', 'SignatureDoesNotMatch'].indexOf(err.code) > -1 && changeToken) {
                changeToken(function (ret) {
                    client.options.accessKeyId = ret.accessKeyId
                    client.options.accessKeySecret = ret.accessKeySecret
                    // client.options.stsToken = ret.stsToken
                    client.options.stsToken = ret.securityToken
                    _this.uploadFile(name, file, progress, success, error)
                })
            } else {
                // 清空本地断点续传记录
                deleteCheckPoint(file)
                error && error(err)
            }
        }).catch(err => {
            console.info('oss出错2' + err)
        })
    }

    // 取消上传文件
    this.cancelUploadFile = function (file) {
        var key = _this.getFileKey(file)
        var checkpoint = checkPointIndexes[key]
        if (checkpoint) {
            client.abortMultipartUpload(checkpoint.name, checkpoint.uploadId)
        }
    }
};
