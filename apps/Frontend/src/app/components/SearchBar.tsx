import { Input } from '@heroui/react'
import React from 'react'

function SearchBar() {
  return (
    <div>
        <Input aria-label="Name" className="w-96" placeholder="Search"  />
    </div>
  )
}

export default SearchBar