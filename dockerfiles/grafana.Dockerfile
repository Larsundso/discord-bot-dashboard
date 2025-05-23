FROM grafana/grafana:latest

COPY ./configs/grafana/provisioning/dashboards/dashboards.yaml /etc/grafana/provisioning/dashboards/
COPY ./configs/grafana/provisioning/datasources/datasources.yml /etc/grafana/provisioning/datasources/

