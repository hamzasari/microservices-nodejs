import { node } from '@opentelemetry/sdk-node';
import { Tracer, trace } from '@opentelemetry/api';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

const { NodeTracerProvider } = node;

const sdks: { [key: string]: Tracer } = {};
const exporter = new OTLPTraceExporter();

export default (serviceName: string): Tracer => {
  if (sdks[serviceName]) {
    return sdks[serviceName];
  }

  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName
    })
  });

  provider.addSpanProcessor(
    new BatchSpanProcessor(exporter, {
      maxQueueSize: 1000,
      scheduledDelayMillis: 30000
    })
  );

  provider.register();

  registerInstrumentations({
    instrumentations: getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': {
        enabled: false
      }
    })
  });

  const tracer = trace.getTracer(serviceName);
  sdks[serviceName] = tracer;
  return tracer;
};
