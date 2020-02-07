const { metricScope, Unit } = require('aws-embedded-metrics')
const axios = require('axios')

module.exports.hello = metricScope(metrics =>
  async (event, context) => {
    metrics.setNamespace('my-app')
    metrics.putDimensions({ Service: "lambda-emf-demo" })

    const start = Date.now()
    const resp = await axios.get('https://theburningmonk.com')
    const end = Date.now()

    metrics.putMetric("latency", end - start, Unit.Milliseconds)
    metrics.putMetric("count", resp.data.length, Unit.Count)
    metrics.setProperty("RequestId", context.awsRequestId)
    metrics.setProperty("ApiGatewayRequestId", event.requestContext.requestId)
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        length: resp.data.length
      })
    }
  })