FROM node@sha256:0557ac14e0d45d02ed563067b82856ca5e7aa3437fa28d98d4350ea9c3d9494a

RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install --yes --no-install-recommends wine64

ENV WINEDEBUG=-all
ENV WINEPREFIX=/tmp/godot-js-runtime-wine

ENTRYPOINT ["/usr/lib/wine/wine64"]
