/**
 * Been - Interactive travel map
 * 
 * Architecture:
 * - Load visits data from JSON
 * - Apply visited state to SVG countries via data-iso attribute
 * - Handle hover tooltips with flag emoji
 * - Handle click to open modal with visit details
 */

const COUNTRY_NAMES = {
  'US': 'United States',
  'FR': 'France',
  'JP': 'Japan',
  'GB': 'United Kingdom',
  'IT': 'Italy',
  'ES': 'Spain',
  'DE': 'Germany',
  'CA': 'Canada',
  'AU': 'Australia',
  'BR': 'Brazil',
  'IN': 'India',
  'CN': 'China',
  'MX': 'Mexico',
  'RU': 'Russia',
  'KR': 'South Korea',
  'NL': 'Netherlands',
  'SE': 'Sweden',
  'NO': 'Norway',
  'DK': 'Denmark',
  'FI': 'Finland',
  'PL': 'Poland',
  'PT': 'Portugal',
  'GR': 'Greece',
  'TR': 'Turkey',
  'EG': 'Egypt',
  'ZA': 'South Africa',
  'AR': 'Argentina',
  'CL': 'Chile',
  'TH': 'Thailand',
  'VN': 'Vietnam',
  'ID': 'Indonesia',
  'PH': 'Philippines',
  'MY': 'Malaysia',
  'SG': 'Singapore',
  'NZ': 'New Zealand',
  'CH': 'Switzerland',
  'AT': 'Austria',
  'BE': 'Belgium',
  'IE': 'Ireland',
  'CZ': 'Czech Republic',
  'HU': 'Hungary',
  'RO': 'Romania',
  'UA': 'Ukraine',
  'IL': 'Israel',
  'SA': 'Saudi Arabia',
  'AE': 'United Arab Emirates',
  'PK': 'Pakistan',
  'BD': 'Bangladesh',
  'NG': 'Nigeria',
  'KE': 'Kenya',
  'MA': 'Morocco',
  'TN': 'Tunisia',
  'CO': 'Colombia',
  'PE': 'Peru',
  'VE': 'Venezuela',
  'IS': 'Iceland',
  'HR': 'Croatia',
  'SI': 'Slovenia',
  'RS': 'Serbia',
  'BG': 'Bulgaria',
  'SK': 'Slovakia',
  'LT': 'Lithuania',
  'LV': 'Latvia',
  'EE': 'Estonia'
};

const rawBaseUrl = (typeof window !== 'undefined' && window.__BEEN_BASE_URL__) || '/';
const BASE_URL = rawBaseUrl.endsWith('/') ? rawBaseUrl : `${rawBaseUrl}/`;
const withBase = (path) => `${BASE_URL}${path.replace(/^\//, '')}`;

class BeenMap {
  constructor() {
    this.visits = {};
    this.tooltip = null;
    this.modal = null;
    this.counter = null;
    this.resetButton = null;
    this.listToggle = null;
    this.listToggleLabel = null;
    this.listWrapper = null;
    this.listContent = null;
    this.listSearch = null;
    this.filterStatus = null;
    this.filterGroup = null;
    this.filterContinent = null;
    this.currentCountry = null;
    this.svg = null;
    this.mapContainer = null;
    this.zoomScale = 1;
    this.minZoom = 1;
    this.maxZoom = 8;
    this.translateX = 0;
    this.translateY = 0;
    this.isPointerDown = false;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.suppressNextClick = false;
    this.clickTimeout = null;
    this.totalCountries = 0;
    this.countries = [];
    this.continentTotals = {};
  }

  async init() {
    try {
      // Load visits data (injected by Astro page with fallback to public path)
      if (window.__BEEN_VISITS__ && typeof window.__BEEN_VISITS__ === 'object') {
        this.visits = window.__BEEN_VISITS__;
      } else {
        const response = await fetch(withBase('/data/visits.json'));
        this.visits = await response.json();
      }
      
      // Setup DOM elements
      this.tooltip = document.querySelector('.tooltip');
      this.modal = document.querySelector('dialog');
      this.counter = document.getElementById('visit-counter');
      this.resetButton = document.getElementById('zoom-reset');
      this.listToggle = document.getElementById('list-toggle');
      this.listToggleLabel = document.getElementById('list-toggle-label');
      this.listWrapper = document.getElementById('list-wrapper');
      this.listContent = document.getElementById('list-content');
      this.listSearch = document.getElementById('list-search');
      this.filterStatus = document.getElementById('filter-status');
      this.filterGroup = document.getElementById('filter-group');
      this.filterContinent = document.getElementById('filter-continent');
      
      // Setup map
      this.setupMap();

      // Setup zoom controls
      this.setupResetControl();
      this.setupZoomInteractions();
      this.setupListView();
      
      // Setup modal close handlers
      this.setupModal();
      await this.loadCountryIndex();
      this.updateVisitedCounter();
      this.renderList();
      this.updateListToggleLabel();
      
    } catch (error) {
      console.error('Failed to initialize map:', error);
    }
  }

  setupMap() {
    const svg = document.querySelector('.map-container svg');
    if (!svg) {
      console.error('SVG map not found');
      return;
    }

    this.svg = svg;
    this.mapContainer = document.querySelector('.map-container');
    this.applyMapTransform();

    // Find all country paths; prefer data-iso when present, but support plain path maps too
    const countries = svg.querySelectorAll('[data-iso], path');
    
    countries.forEach(country => {
      const rawIso = country.getAttribute('data-iso') || '';
      const iso = this.normalizeIso(rawIso);
      const countryName = country.getAttribute('data-name') || COUNTRY_NAMES[iso] || rawIso || 'Country';
      country.dataset.isoNormalized = iso;
      country.dataset.countryName = countryName;
      
      // Add country class
      country.classList.add('country');
      
      // Mark as visited if in data
      if ((iso && this.visits[iso]?.visited) || (rawIso && this.visits[rawIso]?.visited)) {
        country.classList.add('visited');
      }
      
      // Add event listeners
      country.addEventListener('mouseenter', (e) => this.handleHover(e, country));
      country.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      country.addEventListener('mouseleave', () => this.handleHoverEnd());
      country.addEventListener('click', (event) => {
        if (this.suppressNextClick) {
          this.suppressNextClick = false;
          return;
        }

        if (event.detail > 1) {
          if (this.clickTimeout) {
            clearTimeout(this.clickTimeout);
            this.clickTimeout = null;
          }
          return;
        }

        this.clickTimeout = window.setTimeout(() => {
          this.handleClick(country);
          this.clickTimeout = null;
        }, 220);
      });
    });

    this.addCountryDots(countries);
  }

  addCountryDots(countries) {
    if (!this.svg) return;

    const dotsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    dotsGroup.setAttribute('class', 'country-dots');

    countries.forEach((country) => {
      if (!country.getBBox) return;

      const bbox = country.getBBox();
      const area = bbox.width * bbox.height;

      if (area > 22 || bbox.width === 0 || bbox.height === 0) {
        return;
      }

      const cx = bbox.x + (bbox.width / 2);
      const cy = bbox.y + (bbox.height / 2);
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', cx);
      circle.setAttribute('cy', cy);
      circle.setAttribute('r', '1.6');
      circle.classList.add('country-dot');

      const rawIso = country.getAttribute('data-iso') || '';
      circle.setAttribute('data-iso', rawIso);
      circle.dataset.isoNormalized = country.dataset.isoNormalized || this.normalizeIso(rawIso);
      circle.dataset.countryName = country.dataset.countryName || rawIso || 'Country';

      if (country.classList.contains('visited')) {
        circle.classList.add('visited');
      }

      circle.addEventListener('mouseenter', (e) => this.handleHover(e, circle));
      circle.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      circle.addEventListener('mouseleave', () => this.handleHoverEnd());
      circle.addEventListener('click', () => {
        if (this.suppressNextClick) {
          this.suppressNextClick = false;
          return;
        }
        this.handleClick(circle);
      });

      dotsGroup.appendChild(circle);
    });

    if (dotsGroup.childNodes.length > 0) {
      this.svg.appendChild(dotsGroup);
    }
  }

  updateVisitedCounter() {
    if (!this.counter) return;

    const visitedCount = Object.values(this.visits).filter(country => country?.visited).length;
    const total = this.totalCountries || 0;
    this.counter.textContent = `${visitedCount}/${total} visited`;
  }

  async loadCountryIndex() {
    try {
      const response = await fetch(withBase('/maps/countries-optimized.geojson'));
      if (!response.ok) return;
      const data = await response.json();
      this.countries = data.features
        .map((feature) => this.mapFeatureToCountry(feature))
        .filter(Boolean);
      this.totalCountries = this.countries.length;
      this.buildContinentTotals();
      this.populateContinentFilter();
    } catch (error) {
      console.error('Failed to load country index:', error);
    }
  }

  mapFeatureToCountry(feature) {
    const iso = this.resolveIsoCode(feature);
    if (!iso || iso === 'AQ') return null;
    return {
      iso,
      name: feature.properties.ADMIN || iso,
      continent: this.guessContinent(feature.geometry)
    };
  }

  resolveIsoCode(feature) {
    const rawIso = feature?.properties?.ISO_A2;
    if (rawIso && rawIso !== '-99') {
      return rawIso;
    }

    const admin = feature?.properties?.ADMIN;
    const fallback = {
      France: 'FR',
      Norway: 'NO',
      Kosovo: 'XK',
      Somaliland: 'SO',
      'Northern Cyprus': 'CY'
    };
    return fallback[admin] || null;
  }

  guessContinent(geometry) {
    const { lon, lat } = this.getCentroid(geometry);

    if (lon >= -170 && lon < -30 && lat >= 15) return 'North America';
    if (lon >= -90 && lon < -30 && lat < 15) return 'South America';
    if (lon >= -30 && lon < 60 && lat >= 35) return 'Europe';
    if (lon >= -30 && lon < 60 && lat < 35) return 'Africa';
    if (lon >= 60 && lon <= 180 && lat >= 0) return 'Asia';
    if (lon >= 90 && lon <= 180 && lat < 0) return 'Oceania';

    if (lat < 0) return 'Oceania';
    if (lon < -30) return 'North America';
    return 'Europe';
  }

  getCentroid(geometry) {
    let sumLon = 0;
    let sumLat = 0;
    let count = 0;

    const addPoint = (point) => {
      if (!point || point.length < 2) return;
      sumLon += point[0];
      sumLat += point[1];
      count += 1;
    };

    const walk = (coords) => {
      if (!coords) return;
      if (typeof coords[0] === 'number') {
        addPoint(coords);
        return;
      }
      coords.forEach(walk);
    };

    walk(geometry.coordinates);

    if (!count) return { lon: 0, lat: 0 };
    return { lon: sumLon / count, lat: sumLat / count };
  }

  setupListView() {
    if (!this.listToggle || !this.listWrapper) return;

    this.listToggle.addEventListener('click', () => {
      const nextIsListView = !document.body.classList.contains('list-view');
      document.body.classList.toggle('list-view', nextIsListView);
      this.listWrapper.hidden = !nextIsListView;
      this.updateListToggleLabel();
    });

    const rerender = () => this.renderList();
    this.listSearch?.addEventListener('input', rerender);
    this.filterStatus?.addEventListener('change', rerender);
    this.filterGroup?.addEventListener('change', rerender);
    this.filterContinent?.addEventListener('change', rerender);
  }

  updateListToggleLabel() {
    if (!this.listToggleLabel || !this.listToggle) return;
    const isListView = document.body.classList.contains('list-view');
    this.listToggleLabel.textContent = isListView ? 'Map' : 'List';
    this.listToggle.setAttribute('aria-label', isListView ? 'Open map view' : 'Open list view');
  }

  buildContinentTotals() {
    const totals = {};

    this.countries.forEach((country) => {
      if (!totals[country.continent]) {
        totals[country.continent] = { total: 0, visited: 0 };
      }
      totals[country.continent].total += 1;
      if (this.visits[country.iso]?.visited) {
        totals[country.continent].visited += 1;
      }
    });

    this.continentTotals = totals;
  }

  populateContinentFilter() {
    if (!this.filterContinent || this.countries.length === 0) return;
    const continents = Array.from(new Set(this.countries.map((c) => c.continent))).sort();
    const options = ['all', ...continents];

    this.filterContinent.innerHTML = options
      .map((continent) => {
        const label = continent === 'all' ? 'All continents' : continent;
        return `<option value="${continent}">${label}</option>`;
      })
      .join('');
  }

  renderList() {
    if (!this.listContent) return;

    const search = (this.listSearch?.value || '').trim().toLowerCase();
    const statusFilter = this.filterStatus?.value || 'all';
    const groupBy = this.filterGroup?.value || 'continent';
    const continentFilter = this.filterContinent?.value || 'all';

    const filtered = this.countries.filter((country) => {
      const isVisited = Boolean(this.visits[country.iso]?.visited);
      if (statusFilter === 'visited' && !isVisited) return false;
      if (statusFilter === 'not-visited' && isVisited) return false;
      if (continentFilter !== 'all' && country.continent !== continentFilter) return false;
      if (search && !country.name.toLowerCase().includes(search)) return false;
      return true;
    });

    const groups = this.groupCountries(filtered, groupBy);
    this.listContent.innerHTML = groups.map((group) => this.renderGroup(group)).join('');
  }

  groupCountries(countries, groupBy) {
    if (groupBy === 'none') {
      return [{ title: 'All countries', countries }];
    }

    const map = new Map();
    countries.forEach((country) => {
      const key = groupBy === 'status'
        ? (this.visits[country.iso]?.visited ? 'Visited' : 'Not visited')
        : country.continent;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(country);
    });

    return Array.from(map.entries())
      .map(([title, list]) => ({ title, countries: list.sort((a, b) => a.name.localeCompare(b.name)) }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }

  renderGroup(group) {
    const items = group.countries.map((country) => {
      const isVisited = Boolean(this.visits[country.iso]?.visited);
      return `
        <div class="list-item ${isVisited ? 'visited' : ''}">
          <span class="status-dot"></span>
          <span>${country.name}</span>
        </div>
      `;
    }).join('');

    const heading = this.formatGroupHeading(group);

    return `
      <section class="list-group">
        <h3>${heading}</h3>
        <div class="list-grid">
          ${items}
        </div>
      </section>
    `;
  }

  formatGroupHeading(group) {
    const stats = this.continentTotals[group.title];
    if (stats) {
      return `${group.title} (${stats.visited}/${stats.total})`;
    }

    return `${group.title} (${group.countries.length})`;
  }

  positionTooltip(event) {
    if (!this.tooltip) return;

    const offset = 8;
    const tooltipWidth = this.tooltip.offsetWidth || 0;
    const tooltipHeight = this.tooltip.offsetHeight || 0;
    let left = event.clientX + offset;
    let top = event.clientY + offset;

    const maxLeft = window.innerWidth - tooltipWidth - 8;
    const maxTop = window.innerHeight - tooltipHeight - 8;

    if (left > maxLeft) {
      left = event.clientX - tooltipWidth - offset;
    }

    if (top > maxTop) {
      top = event.clientY - tooltipHeight - offset;
    }

    left = Math.max(8, left);
    top = Math.max(8, top);

    this.tooltip.style.left = `${left}px`;
    this.tooltip.style.top = `${top}px`;
  }

  handleHover(event, countryElement) {
    const rawIso = countryElement.getAttribute('data-iso') || '';
    const iso = countryElement.dataset.isoNormalized || this.normalizeIso(rawIso);
    const countryName = countryElement.dataset.countryName || COUNTRY_NAMES[iso] || rawIso || 'Country';
    const countryData = this.visits[iso] || this.visits[rawIso] || { visited: false };
    const flag = iso ? this.getFlag(iso) : '🌍';
    
    // Update tooltip content
    const tooltipCountry = this.tooltip.querySelector('.tooltip-country');
    const tooltipStatus = this.tooltip.querySelector('.tooltip-status');
    
    tooltipCountry.innerHTML = `
      <span class="tooltip-flag">${flag}</span>
      <span>${countryName}</span>
    `;
    
    tooltipStatus.textContent = countryData.visited ? '✓ Visited' : 'Not visited';
    tooltipStatus.className = `tooltip-status ${countryData.visited ? 'visited' : ''}`;
    
    // Position and show tooltip
    this.tooltip.classList.add('visible');
    this.positionTooltip(event);
  }

  handleMouseMove(event) {
    if (this.tooltip.classList.contains('visible')) {
      this.positionTooltip(event);
    }
  }

  handleHoverEnd() {
    this.tooltip.classList.remove('visible');
  }

  handleClick(countryElement) {
    const rawIso = countryElement.getAttribute('data-iso') || '';
    const iso = countryElement.dataset.isoNormalized || this.normalizeIso(rawIso);
    this.currentCountry = iso || rawIso;
    const countryName = countryElement.dataset.countryName || COUNTRY_NAMES[iso] || rawIso || 'Country';
    const countryData = this.visits[iso] || this.visits[rawIso] || { visited: false };
    const flag = iso ? this.getFlag(iso) : '🌍';
    
    // Update modal content
    this.modal.querySelector('.modal-title h2').textContent = countryName;
    this.modal.querySelector('.modal-flag').textContent = flag;
    
    const statusEl = this.modal.querySelector('.modal-status');
    statusEl.textContent = countryData.visited ? '✓ Visited' : 'Not visited';
    statusEl.className = `modal-status ${countryData.visited ? 'visited' : 'not-visited'}`;
    
    // Update visits list
    const visitsList = this.modal.querySelector('.visits-list');
    if (countryData.visited && countryData.visits?.length > 0) {
      visitsList.style.display = 'block';
      const visitsHTML = countryData.visits.map(visit => `
        <div class="visit-item">
          <div class="visit-year">${visit.year}</div>
          <div class="visit-notes">${visit.notes}</div>
        </div>
      `).join('');
      visitsList.innerHTML = `
        <h3>Visits</h3>
        ${visitsHTML}
      `;
    } else {
      visitsList.style.display = 'none';
    }
    
    // Show modal
    this.modal.showModal();
  }

  setupModal() {
    const closeBtn = this.modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => this.modal.close());
    
    // Close on backdrop click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.modal.close();
      }
    });
    
    // Close on escape key (handled by dialog natively)
  }

  getFlag(iso) {
    if (!iso || iso.length !== 2) {
      return '🌍';
    }

    // Convert ISO country code to flag emoji
    // Using regional indicator symbols
    const codePoints = [...iso.toUpperCase()].map(char => 
      127397 + char.charCodeAt(0)
    );
    return String.fromCodePoint(...codePoints);
  }

  normalizeIso(rawIso) {
    if (!rawIso) return '';
    if (rawIso.length === 2) return rawIso.toUpperCase();
    if (rawIso.includes('-')) {
      const parts = rawIso.split('-');
      const tail = parts[parts.length - 1];
      if (tail && tail.length === 2) {
        return tail.toUpperCase();
      }
    }
    return '';
  }

  setupResetControl() {
    if (!this.resetButton) return;
    this.resetButton.addEventListener('click', () => this.resetZoom());
  }

  updateResetButtonVisibility() {
    if (!this.resetButton) return;
    this.resetButton.hidden = this.zoomScale <= 1;
  }

  setupZoomInteractions() {
    if (!this.svg || !this.mapContainer) return;

    this.mapContainer.addEventListener('wheel', (event) => {
      event.preventDefault();

      const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
      this.zoomBy(zoomFactor, event.clientX, event.clientY);
    }, { passive: false });

    this.mapContainer.addEventListener('dblclick', (event) => {
      event.preventDefault();
      if (this.clickTimeout) {
        clearTimeout(this.clickTimeout);
        this.clickTimeout = null;
      }
      this.zoomBy(1.6, event.clientX, event.clientY);
    });

    this.svg.addEventListener('mousedown', (event) => {
      this.isPointerDown = true;
      this.isDragging = false;
      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;
      this.svg.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (event) => {
      if (!this.isPointerDown) return;

      const deltaX = event.clientX - this.dragStartX;
      const deltaY = event.clientY - this.dragStartY;

      if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
        this.isDragging = true;
      }

      this.translateX += deltaX;
      if (this.zoomScale > 1) {
        this.translateY += deltaY;
      }
      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;
      this.applyMapTransform();
    });

    window.addEventListener('mouseup', () => {
      if (!this.isPointerDown) return;

      if (this.isDragging) {
        this.suppressNextClick = true;
      }

      this.isPointerDown = false;
      this.isDragging = false;
      this.svg.style.cursor = 'grab';
    });

    window.addEventListener('resize', () => {
      this.applyMapTransform();
    });
  }

  zoomBy(factor, clientX = null, clientY = null) {
    if (!this.svg || !this.mapContainer) return;

    const previousZoom = this.zoomScale;
    const nextZoom = Math.max(this.minZoom, Math.min(this.maxZoom, previousZoom * factor));

    if (nextZoom === previousZoom) return;

    if (clientX !== null && clientY !== null) {
      const rect = this.mapContainer.getBoundingClientRect();
      const pointX = clientX - rect.left;
      const pointY = clientY - rect.top;
      const scaleRatio = nextZoom / previousZoom;

      this.translateX = pointX - (pointX - this.translateX) * scaleRatio;
      this.translateY = pointY - (pointY - this.translateY) * scaleRatio;
    }

    this.zoomScale = nextZoom;

    if (this.zoomScale <= 1) {
      this.translateX = 0;
      this.translateY = 0;
    }

    this.applyMapTransform();
  }

  resetZoom() {
    this.zoomScale = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.applyMapTransform();
  }

  applyMapTransform() {
    if (!this.svg) return;

    this.clampTranslation();

    this.svg.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.zoomScale})`;
    this.svg.style.cursor = this.isPointerDown ? 'grabbing' : '';
    this.updateResetButtonVisibility();
  }

  clampTranslation() {
    if (!this.mapContainer || !this.svg) return;

    const containerRect = this.mapContainer.getBoundingClientRect();
    const svgRect = this.svg.getBoundingClientRect();
    const scaledWidth = svgRect.width;
    const scaledHeight = svgRect.height;

    const minX = Math.min(0, containerRect.width - scaledWidth);
    const maxX = 0;
    this.translateX = Math.max(minX, Math.min(maxX, this.translateX));

    if (this.zoomScale > 1) {
      const minY = Math.min(0, containerRect.height - scaledHeight);
      const maxY = 0;
      this.translateY = Math.max(minY, Math.min(maxY, this.translateY));
    } else {
      this.translateY = 0;
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const map = new BeenMap();
    map.init();
  });
} else {
  const map = new BeenMap();
  map.init();
}
