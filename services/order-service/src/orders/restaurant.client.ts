import {
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';

const REQUEST_TIMEOUT_MS = 10_000;

export interface RestaurantSnapshot {
  id: string;
  ownerId: string;
  name: string;
  isActive: boolean;
  menuItems: Array<{ id: string; name: string; price: number }>;
}

/**
 * Read-only client for restaurant-service's public API. Used once at order
 * time to validate the restaurant and snapshot menu names/prices (D-013).
 */
@Injectable()
export class RestaurantClient {
  private readonly logger = new Logger(RestaurantClient.name);

  async getRestaurant(restaurantId: string): Promise<RestaurantSnapshot> {
    const baseUrl =
      process.env.RESTAURANT_SERVICE_URL ?? 'http://localhost:3001';

    let response: Response;
    try {
      response = await fetch(`${baseUrl}/restaurants/${restaurantId}`, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch (err) {
      this.logger.error(`restaurant-service unreachable: ${err}`);
      throw new ServiceUnavailableException(
        'Restaurant service is unavailable, try again',
      );
    }

    if (response.status === 404) {
      throw new NotFoundException('Restaurant not found');
    }
    if (!response.ok) {
      this.logger.error(
        `restaurant-service returned ${response.status} for ${restaurantId}`,
      );
      throw new ServiceUnavailableException(
        'Restaurant service is unavailable, try again',
      );
    }

    const body = (await response.json()) as {
      id: string;
      ownerId: string;
      name: string;
      isActive: boolean;
      menuItems: Array<{ id: string; name: string; price: string | number }>;
      categories: Array<{
        menuItems: Array<{ id: string; name: string; price: string | number }>;
      }>;
    };

    // findOne returns available items only: uncategorized at top level,
    // the rest nested under categories — flatten into one lookup list
    const menuItems = [
      ...body.menuItems,
      ...body.categories.flatMap((c) => c.menuItems),
    ].map((m) => ({ id: m.id, name: m.name, price: Number(m.price) }));

    return {
      id: body.id,
      ownerId: body.ownerId,
      name: body.name,
      isActive: body.isActive,
      menuItems,
    };
  }
}
