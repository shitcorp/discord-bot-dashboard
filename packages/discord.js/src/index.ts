import {
  MeterProvider,
  ConsoleMetricExporter,
} from "@opentelemetry/sdk-metrics-base";

export default class DiscordMetrics {
  constructor() {
    const meter = new MeterProvider({
      exporter: new ConsoleMetricExporter(),
      interval: 1000,
    }).getMeter("your-meter-name");

    const requestCount = meter.createCounter("requests", {
      description: "Count all incoming requests",
    });
  }
}
