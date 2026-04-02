'use client'

import { useState, useEffect } from 'react'
import { COLOMBIA_DEPARTMENTS, getCitiesForDepartment } from '@/lib/colombia-departments'

interface ColombiaSelectProps {
  selectedDept: string
  selectedCity: string
  onDeptChange: (dept: string) => void
  onCityChange: (city: string) => void
}

export default function ColombiaSelect({
  selectedDept,
  selectedCity,
  onDeptChange,
  onCityChange,
}: ColombiaSelectProps) {
  const [cities, setCities] = useState<string[]>([])

  useEffect(() => {
    if (selectedDept) {
      const deptCities = getCitiesForDepartment(selectedDept)
      setCities(deptCities)
      if (!deptCities.includes(selectedCity)) {
        onCityChange('')
      }
    } else {
      setCities([])
    }
  }, [selectedDept]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Department */}
      <div>
        <label className="form-label">Departamento *</label>
        <select
          required
          value={selectedDept}
          onChange={(e) => onDeptChange(e.target.value)}
          className="form-input bg-white cursor-pointer"
        >
          <option value="">Seleccionar departamento</option>
          {COLOMBIA_DEPARTMENTS.map((dept) => (
            <option key={dept.name} value={dept.name}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      {/* City */}
      <div>
        <label className="form-label">Ciudad / Municipio *</label>
        <select
          required
          value={selectedCity}
          onChange={(e) => onCityChange(e.target.value)}
          disabled={!selectedDept}
          className="form-input bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">
            {selectedDept ? 'Seleccionar ciudad' : 'Primero selecciona el departamento'}
          </option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
          {selectedDept && (
            <option value="__otro__">Otra ciudad / municipio</option>
          )}
        </select>
      </div>
    </div>
  )
}
