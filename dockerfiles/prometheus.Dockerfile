FROM prom/prometheus

COPY ./configs/prometheus.yml /etc/prometheus/prometheus.yml
