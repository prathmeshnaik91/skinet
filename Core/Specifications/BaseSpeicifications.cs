using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Core.Specifications
{
    public class BaseSpeicifications<T> : ISpecification<T>
    {
        public BaseSpeicifications()
        {
        }

        public BaseSpeicifications(Expression<Func<T, bool>> criteria)
        {
            Criteria=criteria;
        }

        public Expression<Func<T, bool>> Criteria {get;}

        public List<Expression<Func<T, object>>> Includes {get;} = new List<Expression<Func<T, object>>>();

        protected void AddInclude(Expression<Func<T, object>> includeExpressions)
        {
            Includes.Add(includeExpressions);
        }
    }
}