import { ProductCategory } from '@/types';

export interface SubCategoryOption {
  value: string;
  label: string;
}

/**
 * Canonical dosage-form values per category. The `value` is what is stored on
 * the product and what the catalogue filter and the Homoeopathy Products
 * sections group by, so it must stay in slug form.
 */
export const SUB_CATEGORIES: Record<ProductCategory, SubCategoryOption[]> = {
  homoeopathy: [
    { value: 'patent-tonic', label: 'Patent (Tonic)' },
    { value: 'drops', label: 'Drop Products' },
    { value: 'mother-tincture', label: 'Mother Tincture' },
    { value: 'dilution', label: 'Dilution' },
    { value: 'biochemic', label: 'Biochemic' },
    { value: 'tablets', label: 'Homoeopathy Tablet' },
    { value: 'ointment', label: 'Ointment' },
  ],
  cosmetics: [
    { value: 'cream', label: 'Cream' },
    { value: 'gel', label: 'Gel' },
    { value: 'facewash', label: 'Face Wash' },
    { value: 'shampoo', label: 'Shampoo' },
    { value: 'hair-oil', label: 'Hair Oil' },
    { value: 'oil', label: 'Body Oil' },
    { value: 'sanitizer', label: 'Sanitizer / Lotion' },
  ],
  homoeovet: [{ value: 'vet', label: 'Veterinary' }],
};

export const subCategoriesFor = (category: ProductCategory): SubCategoryOption[] =>
  SUB_CATEGORIES[category] ?? [];

export const defaultSubCategoryFor = (category: ProductCategory): string =>
  subCategoriesFor(category)[0]?.value ?? '';

/** Human label for a stored value, falling back to the raw value. */
export const subCategoryLabel = (value: string): string => {
  for (const options of Object.values(SUB_CATEGORIES)) {
    const hit = options.find((o) => o.value === value);
    if (hit) return hit.label;
  }
  return value;
};
