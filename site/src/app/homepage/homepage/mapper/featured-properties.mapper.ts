
import { Builder } from 'builder-pattern';
import { TransactionEnum } from 'src/app/shared/enum/transaction.enum';

import { SearchModel } from '../../../navbar/search/model/search.model';

export class FeaturedPropertiesMapper {

  public static mapFilterFeaturedProperties(finality?: TransactionEnum): SearchModel {
    if (finality) {
      return Builder<SearchModel>()
        .page(1)
        .perPage(6)
        .finality(finality)
        .featured(true)
        .build();
    } else {
      return Builder<SearchModel>()
        .page(1)
        .perPage(6)
        .featured(true)
        .build();
    }
  }

}
