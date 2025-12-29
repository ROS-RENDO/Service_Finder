"use client"
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, Filter, Grid, List, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/common/PageHeader';
import { SearchInput } from '@/components/common/SearchInput';
import { RatingStars } from '@/components/common/RatingStars';
import { EmptyState } from '@/components/common/EmptyState';
import { companies, categories } from '@/data/mockData';
import { Building2 } from 'lucide-react';
import Image from 'next/image';

type ViewMode = 'grid' | 'list';
type SortOption = 'rating' | 'name' | 'price';

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const filteredCompanies = useMemo(() => {
    let result = [...companies];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (company) =>
          company.name.toLowerCase().includes(query) ||
          company.category.toLowerCase().includes(query) ||
          company.description.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'All Categories') {
      result = result.filter((company) => company.category === selectedCategory);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.priceRange.localeCompare(b.priceRange);
        default:
          return 0;
      }
    });

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Service Companies"
        description="Find trusted professionals for all your service needs"
      />

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search companies or services..."
            className="w-full sm:w-80"
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48 bg-card">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-40 bg-card">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="price">Price Range</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex rounded-lg border border-border bg-card p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="h-8 w-8"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredCompanies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No companies found"
          description="Try adjusting your search or filters to find what you're looking for."
        />
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3'
              : 'flex flex-col gap-4'
          }
        >
          {filteredCompanies.map((company, index) => (
            <Card
              key={company.id}
              className={`glass-card hover-lift overflow-hidden animate-slide-up ${
                viewMode === 'list' ? 'flex flex-row items-center' : ''
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={
                  viewMode === 'list'
                    ? 'flex h-24 w-24 shrink-0 items-center justify-center bg-muted p-4'
                    : 'aspect-video w-full bg-muted'
                }
              >
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={200}
                  height={200}
                  className={
                    viewMode === 'list'
                      ? 'h-full w-full object-cover rounded-lg'
                      : 'h-full w-full object-cover'
                  }
                />
              </div>
              <div className={`flex flex-1 flex-col p-5 ${viewMode === 'list' ? 'flex-row items-center justify-between' : ''}`}>
                <div className={viewMode === 'list' ? 'flex-1' : ''}>
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <span className="mb-1 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {company.category}
                      </span>
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {company.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <RatingStars rating={company.rating} size="sm" showValue />
                      <p className="text-xs text-muted-foreground">
                        ({company.reviewCount} reviews)
                      </p>
                    </div>
                  </div>
                  <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {company.location}
                  </div>
                  <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                    {company.description}
                  </p>
                  <p className="mb-4 text-sm font-medium text-foreground">
                    {company.priceRange}
                  </p>
                </div>
                <Button asChild className="w-full" size={viewMode === 'list' ? 'default' : 'default'}>
                  <Link href={`/customer/companies/${company.id}`}>
                    View Services
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
