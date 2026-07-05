#!/usr/bin/env node

import { printDoctorReport, runDoctor } from '@vue-godot/cli'

const report = runDoctor({
  targetDir: process.cwd(),
  exportsOnly: true,
})

printDoctorReport(report)

if (report.errorCount > 0) {
  process.exit(1)
}
