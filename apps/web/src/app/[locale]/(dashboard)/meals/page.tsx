'use client';

import { useState } from 'react';
import {
  Utensils,
  Plus,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Apple,
  Coffee,
  Sandwich,
  Cookie,
  AlertTriangle,
  Users,
  Edit2,
  Trash2,
  Copy,
  Check,
  X,
  Leaf,
  Milk,
  Wheat,
  Fish,
  Egg,
  Nut
} from 'lucide-react';

interface Meal {
  id: string;
  type: 'breakfast' | 'snack_am' | 'lunch' | 'snack_pm';
  name: string;
  description: string;
  allergens: string[];
  vegetarian: boolean;
  calories?: number;
}

interface DayMenu {
  date: string;
  meals: Meal[];
}

const allergenIcons: Record<string, { icon: any; label: string; color: string }> = {
  dairy: { icon: Milk, label: 'Produits laitiers', color: 'bg-blue-100 text-blue-700' },
  gluten: { icon: Wheat, label: 'Gluten', color: 'bg-amber-100 text-amber-700' },
  nuts: { icon: Nut, label: 'Noix', color: 'bg-orange-100 text-orange-700' },
  fish: { icon: Fish, label: 'Poisson', color: 'bg-cyan-100 text-cyan-700' },
  eggs: { icon: Egg, label: 'Œufs', color: 'bg-yellow-100 text-yellow-700' },
};

const mealTypes = [
  { id: 'breakfast', label: 'Déjeuner', icon: Coffee, time: '08:00' },
  { id: 'snack_am', label: 'Collation AM', icon: Apple, time: '10:00' },
  { id: 'lunch', label: 'Dîner', icon: Sandwich, time: '11:30' },
  { id: 'snack_pm', label: 'Collation PM', icon: Cookie, time: '15:00' },
];

const generateWeekDates = (startDate: Date): string[] => {
  const dates: string[] = [];
  for (let i = 0; i < 5; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

const mockMenus: Record<string, DayMenu> = {
  '2024-12-02': {
    date: '2024-12-02',
    meals: [
      { id: '1', type: 'breakfast', name: 'Céréales et fruits', description: 'Céréales multigrains avec banane et lait', allergens: ['dairy', 'gluten'], vegetarian: true, calories: 280 },
      { id: '2', type: 'snack_am', name: 'Fruits frais', description: 'Pommes et raisins', allergens: [], vegetarian: true, calories: 80 },
      { id: '3', type: 'lunch', name: 'Pâtes au poulet', description: 'Pâtes de blé entier avec poulet et légumes', allergens: ['gluten'], vegetarian: false, calories: 450 },
      { id: '4', type: 'snack_pm', name: 'Craquelins et fromage', description: 'Craquelins de riz avec fromage cheddar', allergens: ['dairy'], vegetarian: true, calories: 150 },
    ],
  },
  '2024-12-03': {
    date: '2024-12-03',
    meals: [
      { id: '5', type: 'breakfast', name: 'Pain doré', description: 'Pain doré avec sirop d\'érable et fruits', allergens: ['gluten', 'eggs', 'dairy'], vegetarian: true, calories: 320 },
      { id: '6', type: 'snack_am', name: 'Yogourt', description: 'Yogourt nature avec granola', allergens: ['dairy', 'gluten'], vegetarian: true, calories: 120 },
      { id: '7', type: 'lunch', name: 'Soupe aux légumes', description: 'Soupe maison avec pain', allergens: ['gluten'], vegetarian: true, calories: 280 },
      { id: '8', type: 'snack_pm', name: 'Muffin maison', description: 'Muffin aux bleuets', allergens: ['gluten', 'eggs', 'dairy'], vegetarian: true, calories: 180 },
    ],
  },
  '2024-12-04': {
    date: '2024-12-04',
    meals: [
      { id: '9', type: 'breakfast', name: 'Gruau aux fruits', description: 'Gruau chaud avec pommes et cannelle', allergens: ['gluten'], vegetarian: true, calories: 250 },
      { id: '10', type: 'snack_am', name: 'Légumes et trempette', description: 'Carottes, concombre avec hummus', allergens: [], vegetarian: true, calories: 100 },
      { id: '11', type: 'lunch', name: 'Poisson pané', description: 'Poisson avec riz et brocoli', allergens: ['fish', 'gluten'], vegetarian: false, calories: 420 },
      { id: '12', type: 'snack_pm', name: 'Compote de pommes', description: 'Compote maison sans sucre ajouté', allergens: [], vegetarian: true, calories: 60 },
    ],
  },
};

export default function MealsPage() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);

  const weekDates = generateWeekDates(currentWeekStart);

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      dayName: date.toLocaleDateString('fr-CA', { weekday: 'short' }),
      dayNumber: date.getDate(),
      month: date.toLocaleDateString('fr-CA', { month: 'short' }),
    };
  };

  const getWeekRange = () => {
    const start = new Date(weekDates[0]);
    const end = new Date(weekDates[4]);
    return `${start.getDate()} ${start.toLocaleDateString('fr-CA', { month: 'short' })} - ${end.getDate()} ${end.toLocaleDateString('fr-CA', { month: 'short', year: 'numeric' })}`;
  };

  // Children with allergies (mock data)
  const childrenWithAllergies = [
    { name: 'Emma Dupont', allergies: ['nuts'] },
    { name: 'Lucas Martin', allergies: ['dairy'] },
    { name: 'Chloé Lavoie', allergies: ['gluten'] },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Planification des repas</h1>
          <p className="text-gray-500">Menu hebdomadaire et gestion des allergènes</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            <Copy className="w-4 h-4" />
            Copier semaine
          </button>
          <button
            onClick={() => setShowAddMeal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter repas
          </button>
        </div>
      </div>

      {/* Allergy Alerts */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800">Allergies à surveiller</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {childrenWithAllergies.map((child, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-lg text-sm">
                  <span className="font-medium text-gray-900">{child.name}</span>
                  <span className="text-gray-400">•</span>
                  {child.allergies.map(a => allergenIcons[a]?.label).join(', ')}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPreviousWeek}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-blue" />
            <span className="font-semibold text-gray-900">{getWeekRange()}</span>
          </div>
          <button
            onClick={goToNextWeek}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Week Grid */}
        <div className="grid grid-cols-5 gap-2">
          {weekDates.map((date) => {
            const { dayName, dayNumber } = formatDate(date);
            const isToday = date === new Date().toISOString().split('T')[0];
            const hasMenu = mockMenus[date];
            
            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`p-3 rounded-xl text-center transition-all ${
                  selectedDate === date
                    ? 'bg-brand-blue text-white'
                    : isToday
                    ? 'bg-brand-blue/10 text-brand-blue border-2 border-brand-blue'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <p className={`text-xs uppercase ${selectedDate === date ? 'text-white/80' : 'text-gray-500'}`}>
                  {dayName}
                </p>
                <p className="text-lg font-bold">{dayNumber}</p>
                {hasMenu && (
                  <div className={`w-2 h-2 rounded-full mx-auto mt-1 ${
                    selectedDate === date ? 'bg-white' : 'bg-green-500'
                  }`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Daily Menu */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">
                Menu du {selectedDate ? new Date(selectedDate).toLocaleDateString('fr-CA', { weekday: 'long', day: 'numeric', month: 'long' }) : 'jour sélectionné'}
              </h2>
            </div>

            <div className="p-4 space-y-4">
              {selectedDate && mockMenus[selectedDate] ? (
                mealTypes.map((mealType) => {
                  const meal = mockMenus[selectedDate]?.meals.find(m => m.type === mealType.id);
                  
                  return (
                    <div key={mealType.id} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            <mealType.icon className="w-6 h-6 text-brand-blue" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-gray-900">{mealType.label}</h3>
                              <span className="text-xs text-gray-400">{mealType.time}</span>
                            </div>
                            {meal ? (
                              <>
                                <p className="font-semibold text-gray-900">{meal.name}</p>
                                <p className="text-sm text-gray-500">{meal.description}</p>
                              </>
                            ) : (
                              <p className="text-sm text-gray-400 italic">Non planifié</p>
                            )}
                          </div>
                        </div>
                        
                        {meal && (
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {meal && (
                        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                          {meal.vegetarian && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                              <Leaf className="w-3 h-3" />
                              Végétarien
                            </span>
                          )}
                          {meal.calories && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                              {meal.calories} cal
                            </span>
                          )}
                          {meal.allergens.map((allergen) => {
                            const info = allergenIcons[allergen];
                            return info ? (
                              <span
                                key={allergen}
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${info.color}`}
                              >
                                <info.icon className="w-3 h-3" />
                                {info.label}
                              </span>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>Sélectionnez un jour pour voir le menu</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Allergen Legend */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Légende des allergènes</h3>
            <div className="space-y-2">
              {Object.entries(allergenIcons).map(([key, { icon: Icon, label, color }]) => (
                <div key={key} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-gray-600">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Cette semaine</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Repas planifiés</span>
                <span className="font-semibold text-gray-900">12/20</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Options végétariennes</span>
                <span className="font-semibold text-green-600">75%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Calories moy./jour</span>
                <span className="font-semibold text-gray-900">960</span>
              </div>
            </div>
          </div>

          {/* Meal Templates */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Modèles de repas</h3>
            <div className="space-y-2">
              {['Menu standard', 'Menu végétarien', 'Menu sans gluten', 'Menu fêtes'].map((template) => (
                <button
                  key={template}
                  className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">{template}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Meal Modal */}
      {showAddMeal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowAddMeal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl z-50 p-6 max-h-[90vh] overflow-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Ajouter un repas</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de repas</label>
                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue">
                  {mealTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom du repas</label>
                <input
                  type="text"
                  placeholder="Ex: Pâtes au poulet"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={2}
                  placeholder="Décrivez le repas..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allergènes</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(allergenIcons).map(([key, { icon: Icon, label }]) => (
                    <button
                      key={key}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue" />
                  <span className="text-sm text-gray-700">Option végétarienne</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Calories (optionnel)</label>
                <input
                  type="number"
                  placeholder="Ex: 350"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddMeal(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button className="flex-1 py-2.5 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors">
                Ajouter le repas
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

