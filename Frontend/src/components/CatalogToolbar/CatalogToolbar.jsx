import { PlusIcon, SearchIcon } from '../icons'
import './CatalogToolbar.css'

export default function CatalogToolbar({ search, onSearchChange, searchPlaceholder = 'Buscar', onAdd, addLabel = 'Agregar', extra }) {
  return (
    <div className="catalog-toolbar">
      <label className="catalog-search">
        <SearchIcon className="catalog-search-icon" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </label>

      <div className="catalog-toolbar-extra">
        {extra}
        {onAdd && (
          <button type="button" className="btn btn-primary catalog-add-btn" onClick={onAdd}>
            <PlusIcon /> {addLabel}
          </button>
        )}
      </div>
    </div>
  )
}
